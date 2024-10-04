const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../models/Profile');
const Clan = require('../../models/Clan');

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
                .addStringOption(option => option.setName('image').setDescription('Ajouter une image de profil'))
                .addStringOption(option => 
                    option.setName('color')
                        .setDescription('Modifier la couleur de l\'Embed')
                        .addChoices(
                            { name: 'Rouge', value: 'Red' },
                            { name: 'Bleu', value: 'Blue' },
                            { name: 'Vert', value: 'Green' },
                            { name: 'Jaune', value: 'Yellow' },
                            { name: 'Violet', value: 'Purple' }
                        ))),
    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'view') {
            let profile = await Profile.findOne({ userId });
            if (!profile) {
                profile = new Profile({ userId });

                // Informations spécifiques pour l'utilisateur avec l'identifiant 442296101232574474
                if (userId === '442296101232574474') {
                    profile.description = "PTDRTKI";
                    profile.favoriteGames = ["League Of Degenerates"];
                    profile.passions = ["Le harcèlement en Top-Laner"];
                }

                await profile.save();
            }

            let username = interaction.user.username;
            if (profile.clanId) {
                const clan = await Clan.findById(profile.clanId);
                if (clan) {
                    username = `[${clan.name}] ${username}`;
                }
            }

            const embed = new EmbedBuilder()
                .setColor(profile.color || 'Blue')
                .setTitle(`Profil de ${username}`)
                .setDescription(profile.description)
                .addFields(
                    { name: 'Passions', value: profile.passions.join(', ') || 'Aucune passion' },
                    { name: 'Jeux favoris', value: profile.favoriteGames.join(', ') || 'Aucun jeu favori' }
                )
                .setThumbnail(interaction.user.displayAvatarURL());

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
            const color = interaction.options.getString('color');

            if (description) profile.description = description;
            if (passions) profile.passions = passions.split(',').map(p => p.trim());
            if (games) profile.favoriteGames = games.split(',').map(g => g.trim());
            if (image) profile.image = image;
            if (color) profile.color = color;

            await profile.save();
            return interaction.reply('Votre profil a été mis à jour.');
        }
    }
};