const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Level system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show your current level and XP')),
    async execute(interaction) {
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            return interaction.reply('You have no XP data.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Your Level')
            .addFields(
                { name: 'Level', value: user.level.toString(), inline: true },
                { name: 'XP', value: `${user.xp} / ${user.xpRequired}`, inline: true }
            );

        return interaction.reply({ embeds: [embed] });
    },
};