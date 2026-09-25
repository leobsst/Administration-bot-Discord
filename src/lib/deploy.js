const { Routes } = require('discord.js')

/**
 * Enregistre (en écrasant) toutes les commandes auprès de Discord.
 * Globalement, ou sur un seul serveur si guildId est fourni.
 */
async function deployCommands(rest, applicationId, commands, guildId = null) {
  const route = guildId
    ? Routes.applicationGuildCommands(applicationId, guildId)
    : Routes.applicationCommands(applicationId)

  return rest.put(route, { body: commands.map((command) => command.data.toJSON()) })
}

module.exports = { deployCommands }
