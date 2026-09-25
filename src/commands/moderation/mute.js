const { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, time, TimestampStyles } = require('discord.js')
const { checkHierarchy, moderationEmbed } = require('../../lib/moderation')

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rend un membre muet (exclusion temporaire Discord)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName('membre').setDescription('Membre à rendre muet').setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName('duree')
        .setDescription('Durée du mute (10 minutes par défaut)')
        .addChoices(
          { name: '1 minute', value: MINUTE },
          { name: '5 minutes', value: 5 * MINUTE },
          { name: '10 minutes', value: 10 * MINUTE },
          { name: '1 heure', value: HOUR },
          { name: '1 jour', value: DAY },
          { name: '1 semaine', value: 7 * DAY },
          { name: '28 jours (maximum)', value: 28 * DAY },
        ),
    )
    .addStringOption((option) => option.setName('raison').setDescription('Raison du mute').setMaxLength(512)),

  async execute(interaction) {
    const member = interaction.options.getMember('membre')
    const duration = interaction.options.getInteger('duree') ?? 10 * MINUTE
    const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie'

    if (!member) return interaction.reply({ content: 'Ce membre n\'est pas sur le serveur.', flags: MessageFlags.Ephemeral })
    const error = checkHierarchy(interaction, member, 'mute')
    if (error) return interaction.reply({ content: error, flags: MessageFlags.Ephemeral })
    if (!member.moderatable) return interaction.reply({ content: 'Je ne peux pas mute ce membre (permissions ou rôle insuffisants).', flags: MessageFlags.Ephemeral })

    await member.timeout(duration, `${reason} (par ${interaction.user.tag})`)
    const until = new Date(Date.now() + duration)

    await interaction.reply({
      embeds: [moderationEmbed({
        color: '#969C9F',
        title: 'Mute d\'un membre',
        description: `${member} a été mute jusqu'au ${time(until, TimestampStyles.LongDateTime)} (${time(until, TimestampStyles.RelativeTime)}).`,
        moderator: interaction.user,
        reason,
      })],
    })
  },
}
