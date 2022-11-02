const Discord = require('discord.js')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('SEND_TTS_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        message.delete()
        const member = message.mentions.members.first()
        const reason = args.slice(0).join(' ') || 'Veuillez entrer votre message'
        message.channel.send(reason)
    },
    name: 'msg',
    guildOnly: false
}