const {
  ApplicationCommandType,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} = require('discord.js')

const CATEGORY_LABELS = {
  utility: 'Utilitaires',
  moderation: 'Modération',
  messages: 'Messages',
}

// Commandes globales, ou à défaut celles du serveur (déploiement avec GUILD_ID).
async function fetchDeployedCommands(interaction) {
  try {
    const global = await interaction.client.application.commands.fetch()
    if (global.size || !interaction.guild) return global
    return await interaction.guild.commands.fetch()
  } catch {
    return null
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Liste les commandes du bot')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    // Les commandes déployées portent leur ID : on peut générer des mentions cliquables </nom:id>.
    const deployed = await fetchDeployedCommands(interaction)
    const byCategory = new Map()

    for (const command of interaction.client.commands.values()) {
      const { name, description, type } = command.data
      const isContextMenu = type === ApplicationCommandType.User || type === ApplicationCommandType.Message
      const id = deployed?.find((c) => c.name === name)?.id
      const label = isContextMenu ? `**${name}** (clic droit › Applications)` : id ? `</${name}:${id}>` : `\`/${name}\``
      const line = isContextMenu ? label : `${label} — ${description}`

      if (!byCategory.has(command.category)) byCategory.set(command.category, [])
      byCategory.get(command.category).push(line)
    }

    const embed = new EmbedBuilder()
      .setColor('#ffffff')
      .setTitle('Les commandes du bot')
      .addFields(
        [...byCategory].map(([category, lines]) => ({
          name: CATEGORY_LABELS[category] ?? category,
          value: lines.join('\n'),
        })),
      )
      .setFooter({ text: 'Les commandes de modération et de messages nécessitent les permissions adéquates.' })

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
