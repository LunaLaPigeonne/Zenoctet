const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');

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

        // Load the current .env file
        const envConfig = dotenv.parse(fs.readFileSync(envPath));

        if (status === 'on') {
            envConfig.XP_GAIN_ENABLED = 'true';
            interaction.reply('XP gain has been enabled.');
        } else if (status === 'off') {
            envConfig.XP_GAIN_ENABLED = 'false';
            interaction.reply('XP gain has been disabled.');
        }

        // Write the updated .env file
        const updatedEnvConfig = Object.entries(envConfig)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        fs.writeFileSync(envPath, updatedEnvConfig);
    },
};