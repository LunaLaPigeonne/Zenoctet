const { SlashCommandBuilder } = require('discord.js');

let xpGainEnabled = true;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Level system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Enable or disable XP gain')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('on or off')
                        .setRequired(true)
                        .addChoices(
                            { name: 'on', value: 'on' },
                            { name: 'off', value: 'off' }
                        ))),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const status = interaction.options.getString('status');

        if (status === 'on') {
            xpGainEnabled = true;
            return interaction.reply('XP gain has been enabled.');
        }

        if (status === 'off') {
            xpGainEnabled = false;
            return interaction.reply('XP gain has been disabled.');
        }
    },
};