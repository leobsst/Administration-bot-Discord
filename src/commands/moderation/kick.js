const { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const { askConfirmation, checkHierarchy, moderationEmbed } = require('../../lib/moderation')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption((option) => option.setName('raison').setDescription('Raison de l\'expulsion').setMaxLength(512)),

  async execute(interaction) {
    const member = interaction.options.getMember('membre')
    const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie'

    if (!member) return interaction.reply({ content: 'Ce membre n\'est pas sur le serveur.', flags: MessageFlags.Ephemeral })
    const error = checkHierarchy(interaction, member, 'expulser')
    if (error) return interaction.reply({ content: error, flags: MessageFlags.Ephemeral })
    if (!member.kickable) return interaction.reply({ content: 'Je ne peux pas expulser ce membre (permissions ou rôle insuffisants).', flags: MessageFlags.Ephemeral })

    const confirmation = await askConfirmation(interaction, `Confirmer l'expulsion de ${member} ?\nRaison : ${reason}`)
    if (!confirmation) return

    await member.kick(`${reason} (par ${interaction.user.tag})`)
    await confirmation.update({ content: `${member.user.tag} a été expulsé.`, components: [] })
    await interaction.followUp({
      embeds: [moderationEmbed({
        color: '#CC7900',
        title: 'Expulsion d\'un membre',
        description: `${member} a été expulsé.`,
        moderator: interaction.user,
        reason,
      })],
    })
  },
}
