// commands/Utilities/poll.js
const Poll = require('../../models/Poll');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Create a new poll',
    options: [
        {
            name: 'question',
            type: 'STRING',
            description: 'The question for the poll',
            required: true
        },
        {
            name: 'duration',
            type: 'STRING',
            description: 'The duration of the poll (e.g., 1d, 2d, 3d, 4d, 1w)',
            required: true
        }
    ],
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const duration = interaction.options.getString('duration');

        const endTime = new Date();
        const durationValue = parseInt(duration.slice(0, -1));
        const durationUnit = duration.slice(-1);

        switch (durationUnit) {
            case 'd':
                endTime.setDate(endTime.getDate() + durationValue);
                break;
            case 'w':
                endTime.setDate(endTime.getDate() + durationValue * 7);
                break;
            default:
                return interaction.reply('Invalid duration format. Use "d" for days and "w" for weeks.');
        }

        const poll = new Poll({
            question,
            endTime,
            messageId: '',
            channelId: interaction.channel.id
        });

        const embed = new MessageEmbed()
            .setTitle('New Poll')
            .setDescription(question)
            .setFooter('Click a button to vote!');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('positive')
                    .setLabel('👍 Pour')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('neutral')
                    .setLabel('😐 Neutre')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('negative')
                    .setLabel('👎 Contre')
                    .setStyle('DANGER')
            );

        const pollMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        poll.messageId = pollMessage.id;
        await poll.save();
    }
};