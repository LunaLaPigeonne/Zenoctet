require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const mongoose = require('mongoose');

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
        { name: "🤖 Zenoctet a1.3.5", type: ActivityType.Custom },
        { name: '🌙 Développé par Luna', type: ActivityType.Custom },
        { name: "👊 En collab' avec Alex", type: ActivityType.Custom },
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