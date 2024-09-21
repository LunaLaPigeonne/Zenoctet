const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles'),
    ownerOnly: true,
    adminOnly: false,
    async execute(interaction) {
        const { client, user, member } = interaction;
        const categories = {};

        // Parcourir toutes les commandes et les trier par catégorie
        client.commands.forEach(command => {
            // Vérifier les permissions
            if (command.ownerOnly && user.id !== process.env.BOT_OWNER_ID) return;
            if (command.adminOnly && !member.permissions.has('ADMINISTRATOR')) return;

            const category = command.category || 'Autres';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(command.data.name);
        });

        // Créer un embed pour afficher les commandes
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Liste des commandes')
            .setDescription('Voici la liste des commandes disponibles, triées par catégorie :');

        for (const [category, commands] of Object.entries(categories)) {
            embed.addFields({ name: category, value: commands.join(', '), inline: true });
        }

        await interaction.reply({ embeds: [embed] });
    },
};