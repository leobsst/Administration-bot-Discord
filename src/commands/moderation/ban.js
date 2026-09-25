const { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const { askConfirmation, checkHierarchy, moderationEmbed } = require('../../lib/moderation')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption((option) => option.setName('raison').setDescription('Raison du bannissement').setMaxLength(512))
    .addIntegerOption((option) =>
      option
        .setName('supprimer_messages')
        .setDescription('Supprimer les messages récents du membre')
        .addChoices(
          { name: 'Ne rien supprimer', value: 0 },
          { name: 'Dernière heure', value: 60 * 60 },
          { name: 'Dernières 24 heures', value: 24 * 60 * 60 },
          { name: '7 derniers jours', value: 7 * 24 * 60 * 60 },
        ),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('membre', true)
    const member = interaction.options.getMember('membre')
    const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie'
    const deleteMessageSeconds = interaction.options.getInteger('supprimer_messages') ?? 0

    // Un utilisateur absent du serveur peut quand même être banni (ban préventif).
    if (member) {
      const error = checkHierarchy(interaction, member, 'bannir')
      if (error) return interaction.reply({ content: error, flags: MessageFlags.Ephemeral })
      if (!member.bannable) return interaction.reply({ content: 'Je ne peux pas bannir ce membre (permissions ou rôle insuffisants).', flags: MessageFlags.Ephemeral })
    }

    const confirmation = await askConfirmation(interaction, `Confirmer le bannissement de ${user} ?\nRaison : ${reason}`)
    if (!confirmation) return

    await interaction.guild.members.ban(user, { reason: `${reason} (par ${interaction.user.tag})`, deleteMessageSeconds })
    await confirmation.update({ content: `${user.tag} a été banni.`, components: [] })
    await interaction.followUp({
      embeds: [moderationEmbed({
        color: '#A62019',
        title: 'Bannissement d\'un membre',
        description: `${user} a été banni.`,
        moderator: interaction.user,
        reason,
      })],
    })
  },
}
