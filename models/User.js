const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    xp: { type: Number, default: 0 },
    xpRequired: { type: Number, default: 100 },
    level: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);