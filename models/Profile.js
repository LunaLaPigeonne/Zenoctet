const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    description: { type: String, default: 'Aucune description.' },
    passions: { type: [String], default: [] },
    favoriteGames: { type: [String], default: [] },
    image: { type: String, default: null }, // Pas d'URL par défaut
    clanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clan', default: null }
});

module.exports = mongoose.model('Profile', profileSchema);