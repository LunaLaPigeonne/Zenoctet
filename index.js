require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Poll = require('./models/Poll');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const connectToDatabase = async (connectionString) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
};

const connectionString = 'mongodb+srv://lunalapigeonne:FusionOffi59570@zenoctet.i4lnt.mongodb.net/?retryWrites=true&w=majority&appName=Zenoctet';
connectToDatabase(connectionString);

client.once('ready', async () => {
    const activities = [
        { name: "🤖 Zenoctet Alpha 2.0", type: 'CUSTOM' },
        { name: '⭐️ Ajout des sondages !', type: 'CUSTOM' },
        { name: '🌙 Développé par Luna', type: 'CUSTOM' },
        { name: '👾 Hébergé sur GitHub', type: 'CUSTOM' },
        { name: '💻 Propulsé par Heroku', type: 'CUSTOM' }
    ];

    console.log(`[ZenoLog] Client connecté ! (${client.user.tag})`);

    let currentActivity = 0;

    // Changer l'activité toutes les 5 secondes
    setInterval(() => {
        const activity = activities[currentActivity];
        client.user.setActivity(activity);
        currentActivity = (currentActivity + 1) % activities.length;
    }, 5000);

    await require('./commandHandler')(client);
    await require('./eventHandler')(client);

    // Déclencher l'événement de gestion des sondages expirés toutes les minutes
    setInterval(() => {
        client.emit('pollExpirationCheck');
    }, 60000); // Check every minute
});


client.login(process.env.TOKEN);
