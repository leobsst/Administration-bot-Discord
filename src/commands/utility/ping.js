const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    const response = await interaction.reply({ content: 'Pong…', flags: MessageFlags.Ephemeral, withResponse: true })
    const roundtrip = response.resource.message.createdTimestamp - interaction.createdTimestamp
    await interaction.editReply(`Pong ! 🏓 Aller-retour : \`${roundtrip} ms\` · WebSocket : \`${interaction.client.ws.ping} ms\``)
  },
}
