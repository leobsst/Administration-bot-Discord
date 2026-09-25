const {
  EmbedBuilder,
  InteractionContextType,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js')

const MODAL_TIMEOUT = 10 * 60 * 1000
const HEX_COLOR = /^#?[0-9a-f]{6}$/i

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Envoie un message en embed dans ce salon au nom du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    if (!interaction.channel?.isSendable()) {
      return interaction.reply({ content: 'Je ne peux pas écrire dans ce salon.', flags: MessageFlags.Ephemeral })
    }

    const modalId = `embed:${interaction.id}`
    const modal = new ModalBuilder()
      .setCustomId(modalId)
      .setTitle('Créer un embed')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Titre')
          .setTextInputComponent(new TextInputBuilder().setCustomId('title').setStyle(TextInputStyle.Short).setMaxLength(256).setRequired(false)),
        new LabelBuilder()
          .setLabel('Contenu')
          .setTextInputComponent(new TextInputBuilder().setCustomId('description').setStyle(TextInputStyle.Paragraph).setMaxLength(4000).setRequired(true)),
        new LabelBuilder()
          .setLabel('Couleur')
          .setDescription('Code hexadécimal, ex. #ffffff')
          .setTextInputComponent(new TextInputBuilder().setCustomId('color').setStyle(TextInputStyle.Short).setMinLength(6).setMaxLength(7).setRequired(false).setPlaceholder('#ffffff')),
      )

    await interaction.showModal(modal)

    const submitted = await interaction
      .awaitModalSubmit({ filter: (i) => i.customId === modalId, time: MODAL_TIMEOUT })
      .catch(() => null)
    if (!submitted) return

    const title = submitted.fields.getTextInputValue('title')
    const description = submitted.fields.getTextInputValue('description')
    const color = submitted.fields.getTextInputValue('color') || '#ffffff'

    if (!HEX_COLOR.test(color)) {
      return submitted.reply({ content: `Couleur invalide : \`${color}\`. Utilisez un code hexadécimal comme \`#ffffff\`.`, flags: MessageFlags.Ephemeral })
    }

    const embed = new EmbedBuilder()
      .setColor(color.startsWith('#') ? color : `#${color}`)
      .setDescription(description)
    if (title) embed.setTitle(title)

    await interaction.channel.send({ embeds: [embed] })
    await submitted.reply({ content: 'Embed envoyé.', flags: MessageFlags.Ephemeral })
  },
}
