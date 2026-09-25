const { Events } = require('discord.js')
const config = require('../config')
const { deployCommands } = require('../lib/deploy')

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Connecté en tant que ${client.user.tag} (${client.commands.size} commandes chargées).`)

    // Synchronise les commandes à chaque démarrage : aucune étape de déploiement séparée n'est nécessaire.
    try {
      const data = await deployCommands(client.rest, client.application.id, [...client.commands.values()], config.guildId)
      console.log(`${data.length} commande(s) synchronisée(s) ${config.guildId ? `sur le serveur ${config.guildId}` : 'globalement'}.`)
    } catch (error) {
      console.error('[commandes] Synchronisation impossible :', error)
    }
  },
}
