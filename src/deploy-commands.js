const { REST, Routes } = require('discord.js')
const config = require('./config')
const { loadCommands } = require('./lib/loader')
const { deployCommands } = require('./lib/deploy')

// Déploiement manuel des commandes (le bot les synchronise aussi à chaque démarrage).
async function main() {
  const rest = new REST().setToken(config.token)
  const application = await rest.get(Routes.currentApplication())
  const data = await deployCommands(rest, application.id, loadCommands(), config.guildId)
  console.log(`${data.length} commande(s) déployée(s) ${config.guildId ? `sur le serveur ${config.guildId}` : 'globalement'}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
