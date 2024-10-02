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
            .setTitle('Classement | Niveaux')
            .setDescription('Voici le classement des niveaux sur le serveur');

        for (let i = 0; i < topUsers.length; i++) {
            const user = topUsers[i];
            const discordUser = await interaction.client.users.fetch(user.userId);
            embed.addFields({ name: `${i + 1} — ${discordUser.tag}`, value: `Niveau: ${user.level}, XP: ${user.xp}`});
        }

        await interaction.reply({ embeds: [embed] });
    }
};