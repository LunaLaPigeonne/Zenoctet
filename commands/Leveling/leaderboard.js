const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Affiche le classement des niveaux'),
    async execute(interaction) {
        const topUsers = await Level.find().sort({ level: -1, xp: -1 }).limit(10);

        const embed = new EmbedBuilder()
            .setColor('Gold')
            .setTitle('Classement des niveaux')
            .setDescription('Voici les 10 meilleurs joueurs :');

        for (const user of topUsers) {
            const discordUser = await interaction.client.users.fetch(user.userId);
            embed.addFields({ name: `${discordUser.tag}`, value: `Niveau: ${user.level}, XP: ${user.xp}`, inline: true });
        }

        await interaction.reply({ embeds: [embed] });
    }
};