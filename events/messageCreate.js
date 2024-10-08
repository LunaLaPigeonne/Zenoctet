const Level = require('../models/Level');
const { PermissionsBitField } = require('discord.js');

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

        if (timeDiff >= 10) {
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

        // Vérification du message "quoi" et "feur"
        if (message.content.trim().toLowerCase().endsWith('quoi')) {
            const filter = response => response.content.trim().toLowerCase() === 'feur' && response.author.id !== message.author.id;
            const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });

            collector.on('collect', async response => {
                try {
                    // Vérification des permissions
                    if (response.member.permissions.has(PermissionsBitField.Flags.Administrator) || response.author.id === process.env.BOT_DEV_ID) {
                        return response.reply('Vous ne pouvez pas être mis en timeout pour avoir répondu "feur".');
                    }

                    await response.member.timeout(69000, 'Réponse "feur" après "quoi"');
                    await response.reply(`${response.author}, vous avez été mis en timeout pendant 69 secondes pour avoir répondu "feur" après "quoi".`);
                } catch (error) {
                    console.error('Erreur lors de la mise en timeout :', error);
                }
            });
        }
    }
};