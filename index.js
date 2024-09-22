require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const Config = require('./models/Config');

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
        { name: "🤖 Zenoctet Alpha 1.6", type: ActivityType.Custom },
        { name: '⭐️ Ajout des niveaux !', type: ActivityType.Custom },
        { name: '🌙 Développé par Luna', type: ActivityType.Custom },
        { name: '👾 Hébergé sur GitHub', type: ActivityType.Custom },
        { name: '💻 Propulsé par Heroku', type: ActivityType.Custom }
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

    let config = await Config.findOne({ key: 'XP' });

    if (!config) {
        config = new Config({ key: 'XP', value: 'true' });
        await config.save();
    }

});

client.login(process.env.TOKEN);