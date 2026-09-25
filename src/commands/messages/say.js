const { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Envoie un message dans ce salon au nom du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option.setName('message').setDescription('Contenu du message').setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    if (!interaction.channel?.isSendable()) {
      return interaction.reply({ content: 'Je ne peux pas écrire dans ce salon.', flags: MessageFlags.Ephemeral })
    }

    await interaction.channel.send({
      content: interaction.options.getString('message', true),
      // Empêche un @everyone / @here non voulu.
      allowedMentions: { parse: ['users', 'roles'] },
    })
    await interaction.reply({ content: 'Message envoyé.', flags: MessageFlags.Ephemeral })
  },
}
