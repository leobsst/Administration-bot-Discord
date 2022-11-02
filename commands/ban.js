const Discord = require('discord.js')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        message.delete()
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à bannir.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas bannir le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas Bannir ce membre.')
        if (!member.bannable) return message.channel.send('Le bot ne peut pas bannir ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.ban({reason})
        const ban_embed = new Discord.MessageEmbed()
        .setColor("#A62019")
        .setTitle("Bannissement d'un membre")
        .setThumbnail("https://images.emojiterra.com/google/android-10/512px/26d4.png")
        .setDescription(`${message.mentions.members.first()} a été banni pour ${reason}`)
        .setTimestamp()
        message.channel.send(ban_embed)
    },
    name: 'ban',
    guildOnly: true
}