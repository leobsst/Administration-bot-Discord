const { REST, Routes } = require('discord.js')
const config = require('./config')
const { loadCommands } = require('./lib/loader')

// Enregistre les commandes auprès de Discord. À relancer à chaque ajout/modification de commande.
async function main() {
  const body = loadCommands().map((command) => command.data.toJSON())
  const rest = new REST().setToken(config.token)
  const application = await rest.get(Routes.currentApplication())

  const route = config.guildId
    ? Routes.applicationGuildCommands(application.id, config.guildId)
    : Routes.applicationCommands(application.id)

  const data = await rest.put(route, { body })
  console.log(`${data.length} commande(s) déployée(s) ${config.guildId ? `sur le serveur ${config.guildId}` : 'globalement'}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
