const { Events } = require('discord.js')
const config = require('../config')

module.exports = {
  name: Events.GuildMemberRemove,
  enabled: Boolean(config.welcome.channelId),
  async execute(member) {
    const channel = member.guild.channels.cache.get(config.welcome.channelId)
    if (!channel?.isSendable()) return

    await channel.send(
      `:cry: **${member.user.tag}** a quitté le serveur. On est maintenant \`${member.guild.memberCount}\``,
    ).catch((error) => console.error('[départ] Envoi impossible :', error))
  },
}
