const { EmbedBuilder, InteractionContextType, SlashCommandBuilder, version: djsVersion } = require('discord.js')
const { version } = require('../../../package.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Informations sur le bot')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#ffffff')
      .setTitle('Informations sur le BOT Discord')
      .setDescription(
        'Bot développé par <@203773987338190848>\n' +
        `- Version : ${version}\n` +
        `- discord.js : ${djsVersion}\n` +
        '- Site internet : https://leobsst.fr/\n' +
        '- Contact : `contact@leobsst.fr`',
      )

    await interaction.reply({ embeds: [embed] })
  },
}
