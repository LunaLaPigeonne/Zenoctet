const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: 'Aucune description.' },
    leaderId: { type: String, required: true },
    members: [{ type: String, ref: 'Profile' }]
});

module.exports = mongoose.model('Clan', clanSchema);