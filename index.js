require('dotenv').config();
const { ActivityType, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity({
        name: '🌍 Xenoctet v1.0',
        type: ActivityType.Custom
    })

    await require('./commandHandler')(client);

});

client.login(process.env.TOKEN);