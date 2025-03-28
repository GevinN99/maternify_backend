const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    houseNumber: { type: String, required: true },
    streetName: { type: String, required: true },
    village: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);

