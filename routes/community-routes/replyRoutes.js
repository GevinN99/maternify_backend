const express = require("express")
const userModel = require("../../models/userModel.js")
const auth = require("../../middlewares/auth")
const replyController = require("../../controllers/community-controllers/replyController")
const router = express.Router()

// Create a new reply 
router.post("/create", auth.authenticate, replyController.createReply)

// Get all replies for a post
router.get(
	"/post/:postId",
	auth.authenticate,
	replyController.getRepliesForPost
)

// Get a reply by its ID
router.get(
	"/reply/:replyId",
	auth.authenticate,
	replyController.getReplyById
)

// Like or unlike a reply
router.post(
	"/like-unlike/:replyId",
	auth.authenticate,
	replyController.likeUnlikeReply
)

// Delete a reply
router.delete(
	"/delete/:replyId",
	auth.authenticate,
	replyController.deleteReply
)

module.exports = router
