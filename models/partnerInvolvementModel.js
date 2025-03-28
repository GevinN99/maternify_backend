const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    motherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    partnerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    relationshipStatus: {type: String, default: 'active'},
    sharedNotifications: {type: Boolean, default: true},
});

module.exports = mongoose.model('Partner', partnerSchema);
