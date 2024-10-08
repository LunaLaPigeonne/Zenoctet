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
};