const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);