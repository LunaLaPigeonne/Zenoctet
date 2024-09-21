require('dotenv').config();
const { ActivityType, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity({
        name: '🌍 Xenoctet v1.1.2',
        type: ActivityType.Custom
    })

    await require('./commandHandler')(client);

});

client.on('guildMemberAdd', async member => {
    const channelID = '1283149969158832250';
    const logID = '1286996026019807315';
    const channel = member.guild.channels.cache.get(channelID);
    const log = member.guild.channels.cache.get(logID);
    if (!channel) return;

    const GuildJoin = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Nouveau Membre !')
        .setDescription(`Bienvenue ${member} sur le serveur ! Nous sommes désormais ${member.guild.memberCount} membres !`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    channel.send({ embeds: [GuildJoin] });
    log.send({ embeds: [GuildJoin] });
});

client.on('guildMemberRemove', async member => {
    const channelID = '1286996026019807315';
    const channel = member.guild.channels.cache.get(channelID);
    if (!channel) return;

    const GuildLeave = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle('Membre Parti !')
        .setDescription(`Au revoir ${member}... Nous sommes désormais ${member.guild.memberCount} membres !`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    channel.send({ embeds: [GuildLeave] });
});

client.login(process.env.TOKEN);