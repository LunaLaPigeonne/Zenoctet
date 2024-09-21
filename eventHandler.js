const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => {
                console.log(`Event '${event.name}' triggered`);
                event.execute(...args, client);
            });
        } else {
            client.on(event.name, (...args) => {
                console.log(`Event '${event.name}' triggered`);
                event.execute(...args, client);
            });
        }
        console.log(`Event '${event.name}' loaded`);
    }
};