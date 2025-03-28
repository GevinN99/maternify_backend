const express = require("express")
const userModel = require("../../models/userModel.js")
const auth = require("../../middlewares/auth")
const postController = require("../../controllers/community-controllers/postController")
const router = express.Router()

// Create a new post
router.post("/create", auth.authenticate, postController.createPost)

// Get a specific post by its ID
router.get("/post/:postId", auth.authenticate, postController.getPostById)

// Get all posts from a specific community 
router.get(
	"/community/:communityId",
	auth.authenticate,
	postController.getPostsByCommunity
)

// Get all posts from all communities by a specific user
router.get(
	"/:userId",
	auth.authenticate,
	postController.getPostsByAllCommunities
)

// Delete a post
router.delete("/delete/:postId", auth.authenticate, postController.deletePost)

// Like or unlike a post
router.post(
	"/like-unlike/:postId",
	auth.authenticate,
	postController.likeUnlikePost
)

module.exports = router
