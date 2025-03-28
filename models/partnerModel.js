const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    relationship: { type: String, required: true },
    selectedDate: { type: String, required: true },
});

module.exports = mongoose.model('Partner', PartnerSchema);

