const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    tag: { type: String, required: true, unique: true },
    description: { type: String, default: 'Aucune description.' },
    color: { type: String, default: 'Gold' },
    leaderId: { type: String, required: true },
    members: { type: [String], default: [] }
});

module.exports = mongoose.model('Clan', clanSchema);