require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, MessageEmbed } = require('discord.js');
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

});

setInterval(async () => {
    const now = new Date();
    const expiredPolls = await Poll.find({ endTime: { $lte: now } });

    for (const poll of expiredPolls) {
        const channel = await client.channels.fetch(poll.channelId);
        const message = await channel.messages.fetch(poll.messageId);

        const embed = new MessageEmbed()
            .setTitle('Résultats du sondage')
            .setDescription(poll.question)
            .addField('Positifs', poll.options.positive.toString(), true)
            .addField('Neutre', poll.options.neutral.toString(), true)
            .addField('Négatifs', poll.options.negative.toString(), true);

        await message.edit({ embeds: [embed], components: [] });
        await Poll.deleteOne({ _id: poll._id });
    }
}, 60000); // Check every minute

client.login(process.env.TOKEN);
