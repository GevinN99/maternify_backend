const express = require("express");
const {
    createLocation,
    getAllLocations,
    updateLocation,
    deleteLocation,
} = require("../controllers/locationController");

const router = express.Router();

router.post("/", createLocation); // Save a new location
router.get("/", getAllLocations); // Get all locations
router.put("/:id", updateLocation); // Update a location
router.delete("/:id", deleteLocation); // Delete a location

module.exports = router;
