const User = require('../models/User');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

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
        }

        await user.save();
    },
};