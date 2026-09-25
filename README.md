# Administration bot discord

Bot d'administration Discord basé sur [discord.js](https://discord.js.org/) v14, utilisant les slash commands.

## Prérequis

- Node.js 22.12 ou plus récent
- Une application Discord avec un bot ([Developer Portal](https://discord.com/developers/applications))

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner DISCORD_TOKEN
npm run deploy         # enregistre les slash commands auprès de Discord
npm start
```

Invitez le bot avec les scopes `bot` et `applications.commands`, et les permissions
`Bannir des membres`, `Expulser des membres`, `Exclure temporairement des membres`,
`Envoyer des messages`, `Intégrer des liens` et `Gérer les rôles` (rôle automatique).

`npm run deploy` doit être relancé à chaque ajout ou modification d'une commande.
Avec `GUILD_ID`, le déploiement est instantané sur ce serveur ; sans, il est global.

## Commandes

| Commande | Description | Permission par défaut |
| --- | --- | --- |
| `/help` | Liste les commandes | — |
| `/ping` | Latence du bot | — |
| `/info` | Informations sur le bot | — |
| `/ban` | Bannit un membre (avec confirmation) | Bannir des membres |
| `/kick` | Expulse un membre (avec confirmation) | Expulser des membres |
| `/mute` | Exclusion temporaire Discord (1 min à 28 jours) | Exclure temporairement |
| `/unmute` | Retire l'exclusion temporaire | Exclure temporairement |
| `/say` | Envoie un message au nom du bot | Gérer les messages |
| `/embed` | Envoie un embed via un formulaire | Gérer les messages |
| *Infos du membre* | Clic droit sur un membre › Applications | Exclure temporairement |

Les permissions par défaut peuvent être ajustées par serveur dans
*Paramètres du serveur › Intégrations*.

## Bienvenue / départ

Renseignez `WELCOME_CHANNEL_ID` et/ou `WELCOME_ROLE_ID` dans `.env`, et activez
**Server Members Intent** dans le Developer Portal (onglet *Bot*).

## Structure

```
src/
├── index.js            # client Discord
├── deploy-commands.js  # enregistrement des commandes
├── config.js           # variables d'environnement
├── commands/<catégorie>/<commande>.js
├── events/<événement>.js
└── lib/
```

Pour ajouter une commande, créez un fichier exportant `data` (un `SlashCommandBuilder`)
et `execute(interaction)` dans un dossier de `src/commands/`, puis lancez `npm run deploy`.
