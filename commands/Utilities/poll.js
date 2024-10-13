// commands/Utilities/poll.js
const Poll = require('../../models/Poll');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crée un sondage')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('La question du sondage')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('La durée du sondage (ex: 1h ; 1j ; 2j ; 3j ; 1w)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const duration = interaction.options.getString('duration') || '1d';

        const durationRegex = /^(\d+)([hjw])$/;
        if (!durationRegex.test(duration)) {
            return interaction.reply('La durée du sondage doit être sous la forme `1h`, `1j`, `2j`, `3j` ou `1w`.');
        }

        const reponses = new MessageActionRow()
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
    
    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Sondage')
        .setDescription(question)
        .setFooter(`Sondage créé par ${interaction.user.tag}`)
        .setTimestamp();
    
    const pollMessage = await interaction.reply({ embeds: [embed], components: [reponses] });
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);
        
        const poll = new Poll({
            messageId: pollMessage.id,
            channelId: interaction.channel.id,
            question,
            options: ['Pour', 'Neutre', 'Contre'],
            votes: [],
            expiresAt
        });
        await poll.save();
    }
};