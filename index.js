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

    const activities = [
        { name: "🤖 Projet 'XenoDev'", type: ActivityType.Custom },
        { name: '🌍 Pre-Alpha 1.2 — v2', type: ActivityType.Custom },
        { name: '👾 Hébergé sur GitHub', type: ActivityType.Custom },
        { name: '💻 Propulsé par Heroku', type: ActivityType.Custom }
    ];

    console.log(`Logged in as ${client.user.tag}!`);

    let currentActivity = 0;

    // Changer l'activité toutes les 5 secondes
    setInterval(() => {
        const activity = activities[currentActivity];
        client.user.setActivity(activity);
        currentActivity = (currentActivity + 1) % activities.length;
    }, 5000);

    await require('./commandHandler')(client);
    await require('./eventHandler')(client);
});

client.login(process.env.TOKEN);