const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-level')
        .setDescription('Affiche votre niveau et XP'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userLevel = await Level.findOne({ userId });

        if (!userLevel) {
            return interaction.reply('Vous n\'avez pas encore de niveau.');
        }

        const xpToNextLevel = 100 + (userLevel.level - 1) * 50;
        const rank = await Level.countDocuments({ level: { $gt: userLevel.level } }) + 1;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Votre niveau')
            .addFields(
                { name: 'Niveau', value: `${userLevel.level}`, inline: true },
                { name: 'XP', value: `${userLevel.xp}/${xpToNextLevel}`, inline: true },
                { name: 'Rang', value: `${rank}`, inline: true }
            );

        await interaction.reply({ embeds: [embed] , ephemeral: true });
    }
};