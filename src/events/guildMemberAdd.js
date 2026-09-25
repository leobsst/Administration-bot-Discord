const { Events } = require('discord.js')
const config = require('../config')

module.exports = {
  name: Events.GuildMemberAdd,
  enabled: config.welcomeEnabled,
  async execute(member) {
    const { channelId, roleId } = config.welcome

    if (channelId) {
      const channel = member.guild.channels.cache.get(channelId)
      if (channel?.isSendable()) {
        await channel.send(
          `Salut ${member} ! Toute l'équipe te souhaite la bienvenue sur le serveur discord **${member.guild.name}**. ` +
          `Passe du bon temps parmi nous :wink: ! On est maintenant \`${member.guild.memberCount}\``,
        ).catch((error) => console.error('[bienvenue] Envoi impossible :', error))
      }
    }

    if (roleId) {
      await member.roles.add(roleId, 'Rôle automatique à l\'arrivée')
        .catch((error) => console.error('[bienvenue] Attribution du rôle impossible :', error))
    }
  },
}
