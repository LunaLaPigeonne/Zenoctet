const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Envoie un message de bienvenue avec un bouton pour remplir un formulaire'),
    ownerOnly: true,
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Bienvenue !')
            .setDescription('Cliquez sur le bouton ci-dessous pour remplir le formulaire d\'inscription.');

        const button = new ButtonBuilder()
            .setCustomId('fill_form')
            .setLabel('Remplir le formulaire')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};