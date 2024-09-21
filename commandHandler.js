const fs = require('fs');
const path = require('path');
const { REST, Routes, EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
    client.commands = new Map();
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    const commands = [];

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

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

        if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
            const embed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle('🛑 Accès Refusé')
                .setDescription('Cette commande est réservée au propriétaire du bot.');
            return interaction.reply({ embeds: [embed] });
        }

        if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setColor("DarkRed")
                .setTitle('🛑 Accès Refusé')
                .setDescription('Cette commande est réservée aux administrateurs.');
            return interaction.reply({ embeds: [embed] });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const embed = new MessageEmbed()
                .setColor("DarkRed")
                .setTitle('🛑 Erreur')
                .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
            interaction.reply({ embeds: [embed] });
        }
    });
};