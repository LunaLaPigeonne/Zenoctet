const { SlashCommandBuilder } = require('discord.js');
const Config = require('../../models/Config');

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
        const value = status === 'on' ? 'true' : 'false';

        await Config.findOneAndUpdate(
            { key: 'XP' },
            { value },
            { upsert: true, new: true }
        );

        interaction.client.XP = value;
        interaction.reply(`XP gain has been ${status === 'on' ? 'enabled' : 'disabled'}.`);
    },
};