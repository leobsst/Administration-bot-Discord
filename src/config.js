const fs = require('node:fs')
const path = require('node:path')

// Charge le .env à la racine du projet s'il existe (les variables déjà définies ne sont pas écrasées).
const envFile = path.join(__dirname, '..', '.env')
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)

const token = process.env.DISCORD_TOKEN

if (!token) {
  console.error('La variable d\'environnement DISCORD_TOKEN est manquante (voir .env.example).')
  process.exit(1)
}

module.exports = {
  token,
  // Si défini, les commandes sont déployées sur ce serveur uniquement (instantané, pratique en dev).
  guildId: process.env.GUILD_ID || null,
  welcome: {
    channelId: process.env.WELCOME_CHANNEL_ID || null,
    roleId: process.env.WELCOME_ROLE_ID || null,
  },
  get welcomeEnabled() {
    return Boolean(this.welcome.channelId || this.welcome.roleId)
  },
}
