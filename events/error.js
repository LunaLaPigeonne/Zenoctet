const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'error',
    async execute(error, client) {
        const logChannel = client.channels.cache.get('1286996026019807315');

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Une erreur est survenue')
            .setDescription(`\`\`\`js\n${error}\n\`\`\``)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};