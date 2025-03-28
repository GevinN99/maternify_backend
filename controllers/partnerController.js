const Partner = require('../models/partnerModel');

// Save a new partner
exports.createPartner = async (req, res) => {
    try {
        const newPartner = await Partner.create(req.body);
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all partners
exports.getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update partner by ID
exports.updatePartner = async (req, res) => {
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete partner by ID
exports.deletePartner = async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
