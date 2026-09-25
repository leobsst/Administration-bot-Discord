const { ActivityType, Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js')
const config = require('./config')
const { loadCommands, loadEvents } = require('./lib/loader')

const intents = [GatewayIntentBits.Guilds]
// Intent privilégié : à activer dans le Developer Portal (Bot > Server Members Intent).
if (config.welcomeEnabled) intents.push(GatewayIntentBits.GuildMembers)

const client = new Client({
  intents,
  // Permet de recevoir guildMemberRemove même pour un membre absent du cache.
  partials: [Partials.GuildMember],
  presence: {
    activities: [{ name: 'Administration | /help', type: ActivityType.Watching }],
  },
})

client.commands = new Collection(loadCommands().map((command) => [command.data.name, command]))

for (const event of loadEvents()) {
  if (event.enabled === false) continue
  client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args))
}

client.on(Events.Error, (error) => console.error('[client]', error))
process.on('unhandledRejection', (error) => console.error('[unhandledRejection]', error))

client.login(config.token).catch((error) => {
  console.error('Connexion à Discord impossible :', error.message)
  process.exit(1)
})
