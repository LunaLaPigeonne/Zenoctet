const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Affiche votre niveau et votre progression actuelle'),
    async execute(interaction) {
        const userId = interaction.user.id;

        let user = await User.findOne({ discordId: userId });
        if (!user) {
            user = new User({ discordId: userId });
            await user.save();
        }

        const experienceForNextLevel = getExperienceForNextLevel(user.level);
        const progress = `${user.experience}/${experienceForNextLevel}`;

        const LevelEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Niveau')
            .addFields(
                { name: 'Niveau', value: user.level, inline: true },
                { name: 'Progression', value: progress, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        
        await interaction.reply({ embeds: [LevelEmbed] });
    },
};