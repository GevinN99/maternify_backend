const Location = require('../models/locationModel');

// Save a new location
exports.createLocation = async (req, res) => {
    try {
        console.log("create bbsbhbsa")
        const newLocation = await Location.create(req.body);
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update location by ID
exports.updateLocation = async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete location by ID
exports.deleteLocation = async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

