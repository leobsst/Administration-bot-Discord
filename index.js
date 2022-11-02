const Discord = require('discord.js')
const bot = new Discord.Client()

config = require('./config.json'),
fs = require('fs')

bot.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
  if (err) throw err
  files.forEach(file => {
      if (!file.endsWith('.js')) return
      const command = require(`./commands/${file}`)
      bot.commands.set(command.name, command)
  })
})

bot.on('ready', function () {
  console.log("Je suis connecté !")
  bot.user.setActivity('Administration | !help', {type: "WATCHING"}).catch(console.error)
})

bot.on('message', function (message) {
    if (message.content === '!ping') {
      message.channel.send('pong');
    }
  })

  bot.on('message', function (message) {
    if (message.content === '!dev') {
      message.delete()
      const dev_embed = new Discord.MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Informations sur le BOT Discord")
      .setDescription('Bot développé par <@203773987338190848>\n' +
                      '- Version : 1.0.0\n' +
                      '- Site internet : https://leobsst.fr/ \n' +
                      '- Contact : ``contact@leobsst.fr``') 
      message.channel.send(dev_embed)
    }
  })

  bot.on('message', function (message) {
    if (message.content === '!help') {
      message.delete()
      const help_embed = new Discord.MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Les commandes du bot")
      .setDescription('``MUTE : !mute`` (permet de mute un membre)*\n' +
                      '``UNMUTE : !mute`` (permet de unmute un membre)*\n' +
                      '``BAN : !ban`` (permet de ban un membre)*\n' +
                      '``KICK : !kick`` (permet d\'expulser un membre)*\n' +
                      '``MSG : !msg`` (permet d\'écrire un message avec le bot)*\n' +
                      '``MSGE : !msge`` (permet d\'écrire un message en embed avec le bot)*\n' +
                      '\n' +
                      '*Nécissite les permissions')
      message.channel.send(help_embed)
    }
  })

  bot.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = bot.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisée que dans un serveur.')
    command.run(message, args, bot)
})

bot.on('guildMemberAdd', member => {
  member.guild.channels.cache.get("channel's id where send the message").send('Salut <@' + member.user.id + '>! Toute l’équipe te souhaite la bienvenue sur le serveur discord ' + member.guild.name + '. Passe du bon temps parmi nous :wink: ! On est maintenant ``' + member.guild.memberCount + '``')
  member.roles.add("role's id to add")
})

bot.on('guildMemberRemove', member => {
  member.guild.channels.cache.get("channel's id where send the message").send(':cry: **' + member.user.tag + '** a quitté le serveur On est maintenant ``' + member.guild.memberCount + '``')
})

bot.login('Your bot id')
