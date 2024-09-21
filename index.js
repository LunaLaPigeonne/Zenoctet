require('dotenv').config();
const { ActivityType, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity({
        name: '🌍 Xenoctet v1.1.5',
        type: ActivityType.Custom
    });

    await require('./commandHandler')(client);
});

client.on('guildMemberAdd', async member => {
    const channelID = '1283149969158832250';
    const logID = '1286996026019807315';
    const channel = member.guild.channels.cache.get(channelID);
    const log = member.guild.channels.cache.get(logID);

    if (!channel) {
        console.error(`Channel with ID ${channelID} not found`);
        return;
    }

    if (!log) {
        console.error(`Log channel with ID ${logID} not found`);
        return;
    }

    const GuildJoin = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Nouveau Membre !')
        .setDescription(`Bienvenue ${member} sur le serveur ! Nous sommes désormais ${member.guild.memberCount} membres !`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    try {
        await channel.send({ embeds: [GuildJoin] });
        await log.send({ embeds: [GuildJoin] });
        console.log(`Welcome message sent to ${channelID} and ${logID}`);
    } catch (error) {
        console.error(`Failed to send welcome message: ${error}`);
    }
});

client.on('guildMemberRemove', async member => {
    const channelID = '1286996026019807315';
    const channel = member.guild.channels.cache.get(channelID);

    if (!channel) {
        console.error(`Channel with ID ${channelID} not found`);
        return;
    }

    const GuildLeave = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle('Membre Parti !')
        .setDescription(`${member} a quitté le serveur. Nous sommes désormais ${member.guild.memberCount} membres.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    try {
        await channel.send({ embeds: [GuildLeave] });
        console.log(`Leave message sent to ${channelID}`);
    } catch (error) {
        console.error(`Failed to send leave message: ${error}`);
    }
});

client.login(process.TOKEN);