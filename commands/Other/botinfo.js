const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
var os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Affiche des informations sur le bot'),
    ownerOnly: true,
    adminOnly: false,
    async execute(interaction) {
        const { client } = interaction;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Informations sur le bot')
            .addFields(
                { name: '<:nodejs:1287093728971849798> Version de Node.js', value: process.version },
                { name: '<:discordjs:1287094503785758912> Version de Discord.js', value: require('discord.js').version},
                { name: '<:linux:1287093584029552754> OS', value: os.platform() },
                { name: '<:github:1287093218365673603> Hébergé sur', value: 'GitHub' },
                { name: '<:heroku:1287093558855335977> Déployé sur', value: 'Heroku' },
                { name: 'Uptime', value: `${Math.floor(client.uptime / 1000 / 60)} minutes` },
                { name: 'RAM utilisée', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
            )

        await interaction.reply({ embeds: [embed] });
    },
};