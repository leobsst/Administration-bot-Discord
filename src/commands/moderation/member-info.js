const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  time,
  TimestampStyles,
} = require('discord.js')

// Menu contextuel : clic droit sur un membre > Applications > Infos du membre.
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Infos du membre')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.targetUser
    const member = interaction.targetMember

    const embed = new EmbedBuilder()
      .setColor(member?.displayColor || '#ffffff')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Identifiant', value: `\`${user.id}\``, inline: true },
        { name: 'Compte créé', value: time(user.createdAt, TimestampStyles.RelativeTime), inline: true },
      )

    if (member) {
      const roles = member.roles.cache.filter((role) => role.id !== interaction.guild.id).map((role) => role.toString())
      embed.addFields(
        { name: 'A rejoint le serveur', value: member.joinedAt ? time(member.joinedAt, TimestampStyles.RelativeTime) : 'Inconnu', inline: true },
        { name: 'Mute', value: member.isCommunicationDisabled() ? `Jusqu'à ${time(member.communicationDisabledUntil, TimestampStyles.LongDateTime)}` : 'Non', inline: true },
        { name: `Rôles (${roles.length})`, value: roles.join(' ').slice(0, 1024) || 'Aucun' },
      )
    }

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
