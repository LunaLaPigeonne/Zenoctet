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
                .addStringOption(option => option.setName('description').setDescription('Description du clan')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Rejoindre un clan')
                .addStringOption(option => option.setName('name').setDescription('Nom du clan').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Quitter votre clan'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Voir les informations d\'un clan')
                .addStringOption(option => option.setName('name').setDescription('Nom du clan').setRequired(true))),
    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const name = interaction.options.getString('name');
            const description = interaction.options.getString('description') || 'Aucune description.';

            const existingClan = await Clan.findOne({ name });
            if (existingClan) {
                return interaction.reply('Un clan avec ce nom existe déjà.');
            }

            const clan = new Clan({ name, description, leaderId: userId, members: [userId] });
            await clan.save();

            const profile = await Profile.findOne({ userId });
            if (profile) {
                profile.clanId = clan._id;
                await profile.save();
            }

            return interaction.reply(`Le clan ${name} a été créé avec succès.`);
        } else if (subcommand === 'join') {
            const name = interaction.options.getString('name');
            const clan = await Clan.findOne({ name });
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

            return interaction.reply(`Vous avez rejoint le clan ${name}.`);
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
            const name = interaction.options.getString('name');
            const clan = await Clan.findOne({ name });
            if (!clan) {
                return interaction.reply('Ce clan n\'existe pas.');
            }

            const embed = new EmbedBuilder()
                .setColor('Gold')
                .setTitle(`Clan: ${clan.name}`)
                .setDescription(clan.description)
                .addFields(
                    { name: 'Chef', value: `<@${clan.leaderId}>` },
                    { name: 'Membres', value: clan.members.map(member => `<@${member}>`).join(', ') }
                );

            return interaction.reply({ embeds: [embed] });
        }
    }
};