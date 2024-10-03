const logChannel = client.channels.cache.get('1286996026019807315');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        const embed = new EmbedBuilder()
            .setColor('YELLOW')
            .setTitle('Message Modifié')
            .setDescription(`**Auteur :** ${oldMessage.author}\n**Salon :** ${oldMessage.channel}\n**Ancien Message :** ${oldMessage.content}\n**Nouveau Message :** ${newMessage.content}`)
            .setFooter(`ID : ${oldMessage.id}`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};