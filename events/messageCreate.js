const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Définir le schéma Mongoose pour les niveaux des utilisateurs
const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Fonction pour calculer l'expérience nécessaire pour passer au niveau suivant
const getExperienceForNextLevel = (level) => {
    return 100 * Math.pow(1.5, level - 1);
};

// ID du canal où les messages de niveau seront envoyés
const LEVEL_UP_CHANNEL_ID = '1287429325263601694';

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (!message || !message.author) return;
        if (message.author.bot) return;

        // Vérifier si le message est une commande
        if (message.interaction && message.interaction.isCommand()) return;

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
            const channel = client.channels.cache.get(LEVEL_UP_CHANNEL_ID);
            if (channel) {
                const LevelUpEmbed = new EmbedBuilder()
                    .setColor('GREEN')
                    .setTitle('Niveau Supérieur !')
                    .setDescription(`Félicitations ${message.author} ! Vous êtes maintenant au niveau ${user.level} !`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                channel.send({ embeds: [LevelUpEmbed] }).catch(console.error);
            }
        }
    },
};