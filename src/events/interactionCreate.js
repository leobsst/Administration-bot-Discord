const { Events, MessageFlags } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Slash commands et commandes de menu contextuel (clic droit > Applications).
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
      console.warn(`[commandes] Commande inconnue : ${interaction.commandName}`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(`[commandes] Erreur dans /${interaction.commandName} :`, error)
      const reply = { content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: MessageFlags.Ephemeral }
      if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {})
      else await interaction.reply(reply).catch(() => {})
    }
  },
}
