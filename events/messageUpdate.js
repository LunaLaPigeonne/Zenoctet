const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (oldMessage.author.bot) return;

        const logChannel = client.channels.cache.get('1286996026019807315');

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('Message Modifié')
            .setDescription(`**Auteur :** ${oldMessage.author}\n**Salon :** ${oldMessage.channel}\n**Ancien Message :** ${oldMessage.content}\n**Nouveau Message :** ${newMessage.content}`)
            .setFooter({ text: `ID : ${oldMessage.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};