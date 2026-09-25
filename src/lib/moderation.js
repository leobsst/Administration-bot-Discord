const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  MessageFlags,
} = require('discord.js')

const MODERATION_THUMBNAIL = 'https://images.emojiterra.com/google/android-10/512px/26d4.png'
const CONFIRMATION_TIMEOUT = 30_000

/**
 * Vérifie que l'auteur de l'interaction peut agir sur la cible.
 * Retourne un message d'erreur, ou null si l'action est autorisée.
 * Les permissions du bot (bannable, kickable, moderatable) sont vérifiées par chaque commande.
 */
function checkHierarchy(interaction, target, verb) {
  const { guild, member } = interaction

  if (target.id === interaction.user.id) return `Vous ne pouvez pas vous ${verb} vous-même.`
  if (target.id === guild.ownerId) return `Vous ne pouvez pas ${verb} le propriétaire du serveur.`
  if (target.id === interaction.client.user.id) return `Je ne peux pas me ${verb} moi-même.`
  if (member.id !== guild.ownerId && member.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
    return `Vous ne pouvez pas ${verb} ce membre : son rôle est supérieur ou égal au vôtre.`
  }
  return null
}

function moderationEmbed({ color, title, description, moderator, reason }) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(MODERATION_THUMBNAIL)
    .setDescription(description)
    .setFooter({ text: `Par ${moderator.tag}`, iconURL: moderator.displayAvatarURL() })
    .setTimestamp()

  if (reason) embed.addFields({ name: 'Raison', value: reason })
  return embed
}

/**
 * Affiche une demande de confirmation éphémère avec deux boutons.
 * Retourne l'interaction du bouton "Confirmer", ou null si annulé / expiré
 * (dans ce cas la réponse est déjà mise à jour).
 */
async function askConfirmation(interaction, question) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('confirm').setLabel('Confirmer').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('cancel').setLabel('Annuler').setStyle(ButtonStyle.Secondary),
  )

  const response = await interaction.reply({
    content: question,
    components: [row],
    flags: MessageFlags.Ephemeral,
    withResponse: true,
  })

  let button
  try {
    button = await response.resource.message.awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id === interaction.user.id,
      time: CONFIRMATION_TIMEOUT,
    })
  } catch {
    await interaction.editReply({ content: 'Délai de confirmation expiré, action annulée.', components: [] })
    return null
  }

  if (button.customId === 'cancel') {
    await button.update({ content: 'Action annulée.', components: [] })
    return null
  }
  return button
}

module.exports = { checkHierarchy, moderationEmbed, askConfirmation }
