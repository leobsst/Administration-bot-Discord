const Discord = require('discord.js')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        message.delete()
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à mute.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute ce membre.')
        if (!member.kickable) return message.channel.send('Le bot ne peut pas mute ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.roles.remove('741017728332071024')
        const unmute_embed = new Discord.MessageEmbed()
        .setColor("#969C9F")
        .setTitle("Mute d'un membre")
        .setThumbnail("https://images.emojiterra.com/google/android-10/512px/26d4.png")
        .setDescription(`${message.mentions.members.first()} a été unmute`)
        .setTimestamp()
        message.channel.send(unmute_embed)
    },
    name: 'unmute',
    guildOnly: true
}