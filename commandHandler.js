const fs = require('fs');
const path = require('path');
const { Collection, MessageEmbed } = require('discord.js');

module.exports = async (client) => {
    client.commands = new Collection();
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        const commandName = command.data.name;
        client.commands.set(command.name, command);
        console.log(`Command '${commandName}' loaded`);
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        console.log(`Command '${interaction.commandName}' requested by ${interaction.user.tag}`);

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