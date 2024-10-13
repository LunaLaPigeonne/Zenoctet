const Poll = require('../models/Poll');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pollExpirationHandler',
    async execute(client) {
        const expiredPolls = await Poll.find({ expiresAt: { $lte: new Date() } });

        for (const poll of expiredPolls) {
            const pollMessage = await client.channels.cache.get(poll.channelId).messages.fetch(poll.messageId);

            const results = poll.options.map((option, index) => {
                const votes = poll.votes.filter(vote => vote === index).length;
                return `**${option}** : ${votes} vote${votes === 1 ? '' : 's'}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Sondage Expiré')
                .setDescription(`**Question :** ${poll.question}\n\n${results}`)
                .setFooter({ text: 'Ce sondage a expiré' })
                .setTimestamp();

            pollMessage.edit({ embeds: [embed] });
            pollMessage.reactions.removeAll();
            await pollMessage.react('🔄');
        }

        await Poll.deleteMany({ expiresAt: { $lte: new Date() } });
    }
};