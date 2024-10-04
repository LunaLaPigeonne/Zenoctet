const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Clan = require('../../models/Clan');
const Profile = require('../../models/Profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Gérer les clans')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Créer un clan')
                .addStringOption(option => option.setName('name').setDescription('Nom du clan').setRequired(true))
                .addStringOption(option => option.setName('tag').setDescription('Tag du clan').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('Description du clan')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Rejoindre un clan')
                .addStringOption(option => option.setName('tag').setDescription('Tag du clan').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Quitter votre clan'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Voir les informations d\'un clan')
                .addStringOption(option => option.setName('tag').setDescription('Tag du clan').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Modifier un clan')
                .addStringOption(option => option.setName('tag').setDescription('Tag du clan').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('Nouvelle description'))
                .addStringOption(option => 
                    option.setName('color')
                        .setDescription('Nouvelle couleur de l\'Embed')
                        .addChoices(
                            { name: 'Rouge', value: 'Red' },
                            { name: 'Bleu', value: 'Blue' },
                            { name: 'Vert', value: 'Green' },
                            { name: 'Jaune', value: 'Yellow' },
                            { name: 'Violet', value: 'Purple' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Expulser un membre du clan')
                .addStringOption(option => option.setName('tag').setDescription('Tag du clan').setRequired(true))
                .addUserOption(option => option.setName('member').setDescription('Membre à expulser').setRequired(true))),
    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const name = interaction.options.getString('name');
            const tag = interaction.options.getString('tag');
            const description = interaction.options.getString('description') || 'Aucune description.';

            const existingClan = await Clan.findOne({ tag });
            if (existingClan) {
                return interaction.reply('Un clan avec ce tag existe déjà.');
            }

            const clan = new Clan({ name, tag, description, leaderId: userId, members: [userId] });
            await clan.save();

            const profile = await Profile.findOne({ userId });
            if (profile) {
                profile.clanId = clan._id;
                await profile.save();
            }

            return interaction.reply(`Le clan ${name} (${tag}) a été créé avec succès.`);
        } else if (subcommand === 'join') {
            const tag = interaction.options.getString('tag');
            const clan = await Clan.findOne({ tag });
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            if (clan.members.includes(userId)) {
                return interaction.reply('Vous êtes déjà membre de ce clan.');
            }

            clan.members.push(userId);
            await clan.save();

            const profile = await Profile.findOne({ userId });
            if (profile) {
                profile.clanId = clan._id;
                await profile.save();
            }

            return interaction.reply(`Vous avez rejoint le clan ${clan.name} (${tag}).`);
        } else if (subcommand === 'leave') {
            const profile = await Profile.findOne({ userId });
            if (!profile || !profile.clanId) {
                return interaction.reply('Vous n\'êtes membre d\'aucun clan.');
            }

            const clan = await Clan.findById(profile.clanId);
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            clan.members = clan.members.filter(member => member !== userId);
            await clan.save();

            profile.clanId = null;
            await profile.save();

            return interaction.reply('Vous avez quitté votre clan.');
        } else if (subcommand === 'view') {
            const tag = interaction.options.getString('tag');
            const clan = await Clan.findOne({ tag });
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            const embed = new EmbedBuilder()
                .setColor(clan.color || 'Gold')
                .setTitle(`Clan: ${clan.name} (${clan.tag})`)
                .setDescription(clan.description)
                .addFields(
                    { name: 'Chef', value: `<@${clan.leaderId}>` },
                    { name: 'Membres', value: clan.members.map(member => `<@${member}>`).join(', ') }
                );

            return interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'edit') {
            const tag = interaction.options.getString('tag');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color');

            const clan = await Clan.findOne({ tag });
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            if (clan.leaderId !== userId) {
                return interaction.reply('Vous n\'êtes pas le chef de ce clan.');
            }

            if (description) clan.description = description;
            if (color) clan.color = color;

            await clan.save();
            return interaction.reply(`Le clan ${clan.name} (${tag}) a été mis à jour.`);
        } else if (subcommand === 'kick') {
            const tag = interaction.options.getString('tag');
            const member = interaction.options.getUser('member');

            const clan = await Clan.findOne({ tag });
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            if (clan.leaderId !== userId) {
                return interaction.reply('Vous n\'êtes pas le chef de ce clan.');
            }

            if (!clan.members.includes(member.id)) {
                return interaction.reply('Ce membre ne fait pas partie de ce clan.');
            }

            clan.members = clan.members.filter(m => m !== member.id);
            await clan.save();

            const profile = await Profile.findOne({ userId: member.id });
            if (profile) {
                profile.clanId = null;
                await profile.save();
            }

            return interaction.reply(`Le membre <@${member.id}> a été expulsé du clan ${clan.name} (${tag}).`);
        }
    }
};