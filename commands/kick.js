const Discord = require('discord.js')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        message.delete()
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à exclure.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas exclure le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas exclure ce membre.')
        if (!member.kickable) return message.channel.send('Le bot ne peut pas exclure ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.kick(reason)
        const kick_embed = new Discord.MessageEmbed()
        .setColor("#CC7900")
        .setTitle("Expulsion d'un membre")
        .setThumbnail("https://images.emojiterra.com/google/android-10/512px/26d4.png")
        .setDescription(`${message.mentions.members.first()} a été expulsé pour ${reason}`)
        .setTimestamp()
        message.channel.send(kick_embed)
    },
    name: 'kick',
    guildOnly: true
}