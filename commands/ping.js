const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping command'),
    ownerOnly: true,
    adminOnly: false,
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        let color;
        if (latency < 100) {
            color = "Green"; // Green for good latency
        } else if (latency < 200) {
            color = "Yellow"; // Yellow for moderate latency
        } else {
            color = "DarkRed"; // Red for high latency
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Pong!')
            .setDescription(`Latency is ${latency}ms.`);

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};