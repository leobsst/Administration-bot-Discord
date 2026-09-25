const { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const { checkHierarchy, moderationEmbed } = require('../../lib/moderation')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Retire le mute d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName('membre').setDescription('Membre à unmute').setRequired(true))
    .addStringOption((option) => option.setName('raison').setDescription('Raison du unmute').setMaxLength(512)),

  async execute(interaction) {
    const member = interaction.options.getMember('membre')
    const reason = interaction.options.getString('raison')

    if (!member) return interaction.reply({ content: 'Ce membre n\'est pas sur le serveur.', flags: MessageFlags.Ephemeral })
    if (!member.isCommunicationDisabled()) return interaction.reply({ content: `${member} n'est pas mute.`, flags: MessageFlags.Ephemeral })
    const error = checkHierarchy(interaction, member, 'unmute')
    if (error) return interaction.reply({ content: error, flags: MessageFlags.Ephemeral })
    if (!member.moderatable) return interaction.reply({ content: 'Je ne peux pas unmute ce membre (permissions ou rôle insuffisants).', flags: MessageFlags.Ephemeral })

    await member.timeout(null, `${reason ?? 'Aucune raison fournie'} (par ${interaction.user.tag})`)

    await interaction.reply({
      embeds: [moderationEmbed({
        color: '#969C9F',
        title: 'Unmute d\'un membre',
        description: `${member} n'est plus mute.`,
        moderator: interaction.user,
        reason,
      })],
    })
  },
}
