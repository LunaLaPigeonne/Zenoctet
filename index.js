require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity({
        name: '🌍 Xenoctet v1.2',
        type: ActivityType.Custom
    });

    await require('./commandHandler')(client);
    await require('./eventHandler')(client);
});

client.login(process.env.TOKEN);