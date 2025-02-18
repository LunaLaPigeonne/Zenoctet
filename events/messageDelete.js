const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (message.author.bot) return;

        const logChannel = client.channels.cache.get('1286996026019807315');

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Message Supprimé')
            .setDescription(`**Auteur :** ${message.author}\n**Salon :** ${message.channel}\n**Message :** ${message.content}`)
            .setFooter({ text: `ID : ${message.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};