const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message || !message.author || message.author.bot) return;

        const xpGain = Math.floor(Math.random() * 7) + 1;
        let user = await User.findOne({ userId: message.author.id });

        if (!user) {
            user = new User({ userId: message.author.id });
        }

        user.xp += xpGain;

        if (user.xp >= user.xpRequired) {
            user.level += 1;
            user.xp -= user.xpRequired;
            user.xpRequired += 50; // Increment XP required for next level

            const channel = client.channels.cache.get('1287429325263601694');

            const levelUpEmbed = new EmbedBuilder()
                .setTitle('Gain de niveau !')
                .setColor('Gold')
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Félicitations, ${message.author} ! Tu es passé au niveau ${user.level} !\nTu as désormais besoin de ${user.xpRequired} XP pour passer au niveau suivant.`);

            channel.send({ embeds: [levelUpEmbed] });
        }

        await user.save();
    },
};