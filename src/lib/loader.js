const fs = require('node:fs')
const path = require('node:path')

const COMMANDS_DIR = path.join(__dirname, '..', 'commands')
const EVENTS_DIR = path.join(__dirname, '..', 'events')

/**
 * Charge toutes les commandes de src/commands/<catégorie>/<commande>.js.
 * La catégorie (nom du dossier) est utilisée par /help.
 */
function loadCommands() {
  const commands = []

  for (const category of fs.readdirSync(COMMANDS_DIR)) {
    const categoryDir = path.join(COMMANDS_DIR, category)
    if (!fs.statSync(categoryDir).isDirectory()) continue

    for (const file of fs.readdirSync(categoryDir).filter((f) => f.endsWith('.js'))) {
      const command = require(path.join(categoryDir, file))
      if (!command.data || typeof command.execute !== 'function') {
        console.warn(`[commandes] ${category}/${file} ignoré : "data" ou "execute" manquant.`)
        continue
      }
      commands.push({ ...command, category })
    }
  }

  return commands
}

function loadEvents() {
  return fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((file) => require(path.join(EVENTS_DIR, file)))
}

module.exports = { loadCommands, loadEvents }
