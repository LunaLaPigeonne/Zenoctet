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

module.exports = async (client, message) => {
    if (message.author.bot) return;

    const randomExperience = Math.floor(Math.random() * 5) + 1;

    let user = await User.findOne({ discordId: message.author.id });
    if (!user) {
        user = new User({ discordId: message.author.id });
    }

    user.experience += randomExperience;

    let experienceForNextLevel = getExperienceForNextLevel(user.level);
    while (user.experience >= experienceForNextLevel) {
        user.level += 1;
        user.experience -= experienceForNextLevel;
        experienceForNextLevel = getExperienceForNextLevel(user.level);
    }

    await user.save();
};