const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(member, client) {
        const channelID = 'YOUR_CHANNEL_ID';
        const channel = member.guild.channels.cache.get(channelID);

        if (!channel) {
            console.error(`Channel with ID ${channelID} not found`);
            return;
        }

        const GuildJoin = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Nouveau Membre !')
            .setDescription(`Bienvenue ${member} sur le serveur ! Nous sommes désormais ${member.guild.memberCount} membres !`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        channel.send({ embeds: [GuildJoin] }).catch(console.error);
    },
};