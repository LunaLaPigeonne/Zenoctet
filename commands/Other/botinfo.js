const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
var os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Affiche des informations sur le bot'),
    ownerOnly: false,
    adminOnly: false,
    async execute(interaction) {
        const { client } = interaction;

        const embed = new EmbedBuilder()
            .setColor('BLUE')
            .setTitle('Informations sur le bot')
            .addFields(
                { name: 'Version de Node.js', value: process.version, inline: true },
                { name: 'Version de Discord.js', value: require('discord.js').version, inline: true },
                { name: 'OS', value: os.platform(), inline: true },
                { name: 'Uptime', value: `${Math.floor(client.uptime / 1000 / 60)} minutes`, inline: true },
                { name: 'Mémoire utilisée', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
            )

        await interaction.reply({ embeds: [embed] });
    },
};