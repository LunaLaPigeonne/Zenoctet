module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity({
            name: '🌍 Xenoctet v1.1.8',
            type: 'CUSTOM_STATUS'
        });
    },
};