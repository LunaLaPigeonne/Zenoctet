const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => {
                console.log(`[XenoLog] Event '${event.name}' triggered`);
                event.execute(...args, client);
            });
        } else {
            client.on(event.name, (...args) => {
                if (event.name === 'messageCreate') {
                    event.execute(client, ...args);
                }
                else {
                    console.log(`[XenoLog] Event '${event.name}' triggered`);
                    event.execute(...args, client);
                }
            });
        }
        console.log(`Event '${event.name}' loaded from file '${file}'`);
    }
};