const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Définir le schéma Mongoose pour les niveaux des utilisateurs
const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    requiredExperience: { type: Number, default: 100 } // Ajouter le champ requiredExperience
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
            user.requiredExperience = getExperienceForNextLevel(user.level); // Initialiser requiredExperience
        }

        user.experience += randomExperience;

        // Vérifier si l'utilisateur a atteint le niveau suivant
        if (user.experience >= user.requiredExperience) {
            user.level += 1;
            user.experience = 0; // Réinitialiser l'expérience après le passage au niveau suivant
            user.requiredExperience = getExperienceForNextLevel(user.level); // Mettre à jour requiredExperience

            const levelUpEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Niveau supérieur !')
                .setDescription(`${message.author.username} est maintenant niveau ${user.level} !`)
                .setTimestamp();

            const levelUpChannel = client.channels.cache.get(LEVEL_UP_CHANNEL_ID);
            if (levelUpChannel) {
                levelUpChannel.send({ embeds: [levelUpEmbed] });
            }
        }

        await user.save();
    },
};