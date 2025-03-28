const express = require("express");
const {
    createPartner,
    getAllPartners,
    updatePartner,
    deletePartner,
} = require("../controllers/partnerController");

const router = express.Router();

router.post("/", createPartner); // Save a new partner
router.get("/", getAllPartners); // Get all partners
router.put("/:id", updatePartner); // Update a partner
router.delete("/:id", deletePartner); // Delete a partner

module.exports = router;

