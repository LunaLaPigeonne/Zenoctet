const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: String,
    options: {
        positive: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        negative: { type: Number, default: 0 }
    },
    endTime: Date,
    messageId: String,
    channelId: String
});

module.exports = mongoose.model('Poll', pollSchema);