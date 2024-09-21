require('dotenv').config();
const { ActivityType, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    await require('./commandHandler')(client);
    await require('./eventHandler')(client);
});

client.login(process.env.TOKEN);