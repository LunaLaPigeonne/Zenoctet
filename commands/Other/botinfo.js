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

        // Calculer l'uptime en millisecondes
        const uptime = client.uptime;
        const uptimeSeconds = Math.floor(uptime / 1000);
        const uptimeMinutes = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        const uptimeDays = Math.floor(uptimeHours / 24);

        // Formater l'uptime en fonction de la durée
        let uptimeString;
        if (uptimeMinutes < 60) {
            uptimeString = `${uptimeMinutes} minutes, ${uptimeSeconds % 60} secondes`;
        } else if (uptimeHours < 24) {
            uptimeString = `${uptimeHours} heures, ${uptimeMinutes % 60} minutes, ${uptimeSeconds % 60} secondes`;
        } else {
            uptimeString = `${uptimeDays} jours, ${uptimeHours % 24} heures, ${uptimeMinutes % 60} minutes, ${uptimeSeconds % 60} secondes`;
        }

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Informations sur le bot')
            .addFields(
                { name: '<:nodejs:1287093728971849798> Version de Node.js', value: process.version },
                { name: '<:discordjs:1287094503785758912> Version de Discord.js', value: require('discord.js').version },
                { name: '<:linux:1287093584029552754> OS', value: os.platform() },
                { name: '<:github:1287093218365673603> Hébergé sur', value: 'GitHub' },
                { name: '<:heroku:1287093558855335977> Déployé sur', value: 'Heroku' },
                { name: 'Uptime', value: uptimeString }
            );

        await interaction.reply({ embeds: [embed] });
    },
};