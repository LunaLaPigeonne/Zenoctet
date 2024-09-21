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
            emoji = "<:ping1:1287098911550341232>";
        } else if (latency < 200) {
            color = "Yellow"; // Yellow for moderate latency
            emoji = "<:ping2:1287098963849252884>";
        } else {
            color = "DarkRed"; // Red for high latency
            emoji = "<:ping3:1287098996636258417>";
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Pong!')
            .setDescription(`${emoji} Latency is ${latency}ms.`);

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};