const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-set')
        .setDescription('Level system commands')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Enable or disable XP gain')
                .setRequired(true)
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' }
                )),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const status = interaction.options.getString('status');

        if (status === 'on') {
            config.xpGainEnabled = true;
            return interaction.reply('XP gain has been enabled.');
        }

        if (status === 'off') {
            config.xpGainEnabled = false;
            return interaction.reply('XP gain has been disabled.');
        }
    },
};