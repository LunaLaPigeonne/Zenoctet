const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection, MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = async (client) => {
    client.commands = new Collection();
    const commands = [];
    const categories = fs.readdirSync(path.join(__dirname, 'commands'));

    for (const category of categories) {
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', category)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, 'commands', category, file));
            const commandName = command.data.name;
            command.category = category; // Ajouter la catégorie à la commande
            client.commands.set(commandName, command);
            commands.push(command.data.toJSON());
            console.log(`[XenoLoader] Command '${commandName}' loaded from category '${category}'`);
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    try {
        console.log('[XenoLog] Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('[XenoLog] Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        console.log(`[XenoLog] Command '${interaction.commandName}' requested by ${interaction.user.tag}`);

        // Vérification des permissions
        if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
            if (command.devOnly && interaction.user.id !== process.env.BOT_DEV_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée au développeurs du bot.', ephemeral: true });
        }};


        if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
            console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
            return interaction.reply({ content: 'Cette commande est réservée aux administrateurs.', ephemeral: true });
        };

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`[XenoError] Erreur lors de l'exécution de la commande '${interaction.commandName}' :`, error);
            const embed = new MessageEmbed()
                .setColor("DarkRed")
                .setTitle('🛑 Erreur')
                .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
            interaction.reply({ embeds: [embed] });
        }
    });
};