const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../models/Profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Gérer votre profil')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Voir votre profil'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Modifier votre profil')
                .addStringOption(option => option.setName('description').setDescription('Ajouter une description'))
                .addStringOption(option => option.setName('passions').setDescription('Ajouter des passions, séparées par des virgules'))
                .addStringOption(option => option.setName('games').setDescription('Ajouter des jeux favoris, séparés par des virgules'))
                .addStringOption(option => option.setName('image').setDescription('Ajouter une image de profil'))),
    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'view') {
            const profile = await Profile.findOne({ userId });
            if (!profile) {
                return interaction.reply('Vous n\'avez pas encore de profil.');
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`Profil de ${interaction.user.username}`)
                .setDescription(profile.description)
                .addFields(
                    { name: 'Passions', value: profile.passions.join(', ') || 'Aucune passion' },
                    { name: 'Jeux favoris', value: profile.favoriteGames.join(', ') || 'Aucun jeu favori' }
                );

            if (profile.image) {
                embed.setImage(profile.image);
            }

            return interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'edit') {
            let profile = await Profile.findOne({ userId });
            if (!profile) {
                profile = new Profile({ userId });
            }

            const description = interaction.options.getString('description');
            const passions = interaction.options.getString('passions');
            const games = interaction.options.getString('games');
            const image = interaction.options.getString('image');

            if (description) profile.description = description;
            if (passions) profile.passions = passions.split(',').map(p => p.trim());
            if (games) profile.favoriteGames = games.split(',').map(g => g.trim());
            if (image) profile.image = image;

            await profile.save();
            return interaction.reply('Votre profil a été mis à jour.');
        }
    }
};