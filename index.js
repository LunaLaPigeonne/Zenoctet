require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

// Charger les événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (file === 'messageCreate.js') {
        client.on('messageCreate', event.bind(null, client));
    }
}

client.once('ready', async () => {
    const activities = [
        { name: "🤖 Zenoctet Alpha 1.4", type: ActivityType.Custom },
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
});

client.login(process.env.TOKEN);