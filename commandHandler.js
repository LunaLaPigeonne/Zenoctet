const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection, MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = async (client) => {
    client.commands = new Collection();
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        const commandName = command.data.name;
        client.commands.set(commandName, command);
        commands.push(command.data.toJSON());
        console.log(`Command '${commandName}' loaded`);
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        console.log(`Command '${interaction.commandName}' requested by ${interaction.user.tag}`);

        // Vérification des permissions
        if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
            return interaction.reply({ content: 'Cette commande est réservée au développeur du bot.', ephemeral: true });
        }

        if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Cette commande est réservée aux administrateurs.', ephemeral: true });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command '${interaction.commandName}':`, error);
            const embed = new MessageEmbed()
                .setColor("DarkRed")
                .setTitle('🛑 Erreur')
                .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
            interaction.reply({ embeds: [embed] });
        }
    });
};