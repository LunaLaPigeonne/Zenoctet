const Level = require('../models/Level');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        const userId = message.author.id;
        const now = new Date();

        let userLevel = await Level.findOne({ userId });

        if (!userLevel) {
            userLevel = new Level({ userId });
        }

        const timeDiff = (now - userLevel.lastMessage) / 1000;

        if (timeDiff < 10) return;

        const xpGain = Math.floor(Math.random() * 10) + 1;
        userLevel.xp += xpGain;
        userLevel.lastMessage = now;

        const xpToNextLevel = 100 + (userLevel.level - 1) * 50;

        if (userLevel.xp >= xpToNextLevel) {
            userLevel.level += 1;
            userLevel.xp -= xpToNextLevel;

            const channel = client.channels.cache.get('1287429325263601694');
            if (channel) {
                channel.send(`🎉 ${message.author} a atteint le niveau ${userLevel.level} !`);
            }
        }

        await userLevel.save();
    }
};