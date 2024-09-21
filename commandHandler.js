const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`Command '${command.name}' loaded`);
    }

    client.on('messageCreate', message => {
        if (message.author.bot) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        console.log(`Command '${command.name}' requested by ${message.author.tag}`);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(`Error executing command '${command.name}':`, error);
            message.reply('There was an error trying to execute that command!');
        }
    });
};