const mongoose = require('mongoose');

// Définir le schéma Mongoose pour les niveaux des utilisateurs
const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

const User = mongoose.model('User', userSchema);

// Fonction pour calculer l'expérience nécessaire pour passer au niveau suivant
const getExperienceForNextLevel = (level) => {
    return 100 * Math.pow(1.5, level - 1);
};

// ID du canal où les messages de niveau seront envoyés
const LEVEL_UP_CHANNEL_ID = 'your_channel_id_here';

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
    if (message.author.bot) return;

    const randomExperience = Math.floor(Math.random() * 5) + 1;

    let user = await User.findOne({ discordId: message.author.id });
    if (!user) {
        user = new User({ discordId: message.author.id });
    }

    user.experience += randomExperience;

    let experienceForNextLevel = getExperienceForNextLevel(user.level);
    let leveledUp = false;

    while (user.experience >= experienceForNextLevel) {
        user.level += 1;
        user.experience -= experienceForNextLevel;
        experienceForNextLevel = getExperienceForNextLevel(user.level);
        leveledUp = true;
    }

    await user.save();

    if (leveledUp) {
        console.log(`User ${message.author.id} leveled up to level ${user.level}`);
        const channel = client.channels.cache.get(LEVEL_UP_CHANNEL_ID);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('Niveau Supérieur !')
                .setDescription(`Félicitations <@${message.author.id}> ! Tu as atteint le niveau ${user.level} !`)
                .setColor('Gold')
                .setTimestamp();
                channel.send({ embeds: [embed] }).catch(console.error);
            }
        }
    }
};