const express = require("express")
const userModel = require("../../models/userModel.js")
const auth = require("../../middlewares/auth")
const communityController = require("../../controllers/community-controllers/communityController")
const router = express.Router()

// Get all communities by a specific user
router.get("/:userId", auth.authenticate, communityController.getAllCommunities)

// Get a specific community by its ID
router.get(
	"/community/:communityId",
	auth.authenticate,
	communityController.getCommunityById
)

// Create a new community
router.post("/create", auth.authenticate, communityController.createCommunity)

// Update a community
router.put(
	"/update/:communityId",
	auth.authenticate,
	communityController.updateCommunity
)

// Delete a community
router.delete(
	"/delete/:communityId",
	auth.authenticate,
	communityController.deleteCommunity
)

// Join a community
router.post(
	"/join/:communityId",
	auth.authenticate,
	communityController.joinCommunity
)

// Leave a community
router.post(
	"/leave/:communityId",
	auth.authenticate,
	communityController.leaveCommunity
)

router.get(
	"/members/:communityId",
	auth.authenticate,
	communityController.getCommunityMembers
)

router.delete(
	"/community/:communityId/members/:memberId",
	auth.authenticate,
	communityController.removeMember
)

module.exports = router
