const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Définir le schéma Mongoose pour les niveaux des utilisateurs
const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    requiredExperience: { type: Number, default: 100 }
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Fonction pour calculer l'expérience nécessaire pour passer au niveau suivant
const getExperienceForNextLevel = (level) => {
    return 100 * Math.pow(1.25, level);
};

// Fonction pour ajouter de l'expérience à un utilisateur
const addExperience = async (userId, experience) => {
    let user = await User.findOne({ discordId: userId });
    if (!user) {
        user = new User({ discordId: userId });
    }

    user.experience += experience;

    // Vérifier si l'utilisateur a atteint l'expérience requise pour passer au niveau suivant
    while (user.experience >= user.requiredExperience) {
        user.experience -= user.requiredExperience;
        user.level += 1;
        user.requiredExperience = getExperienceForNextLevel(user.level);
    }

    await user.save();
    return user;
};

// ID du canal où les messages de niveau seront envoyés
const LEVEL_UP_CHANNEL_ID = '1287429325263601694';

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.channel.type === 'dm') return;
        if (!message || !message.author) return;
        if (message.author.bot) return;

        const experienceGained = Math.floor(Math.random() * 7) + 1;
        const user = await addExperience(message.author.id, experienceGained);

        if (user.level > 0 && user.experience === 0) {
            const channel = client.channels.cache.get(LEVEL_UP_CHANNEL_ID);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle('Niveau supérieur !')
                    .setDescription(`${message.author.username} est maintenant au niveau ${user.level}!\nIl as désormais besoin de ${user.requiredExperience} points d'expérience pour passer au niveau suivant.`)
                    .setColor('GREEN');
                channel.send({ embeds: [embed] });
            }
        }
    },
};