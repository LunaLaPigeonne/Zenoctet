const logChannel = client.channels.cache.get('1286996026019807315');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setColor('RED')
            .setTitle('Message Supprimé')
            .setDescription(`**Auteur :** ${message.author}\n**Salon :** ${message.channel}\n**Message :** ${message.content}`)
            .setFooter(`ID : ${message.id}`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};