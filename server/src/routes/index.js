const express = require("express");
const router = express.Router();

// Controllers
const { register, login, checkAuth } = require("../controllers/auth");
const {
  getUsers,
  editUser,
  deleteUser,
  getFollowers,
  getFollowing,
  getUserFeeds,
  getUserProfile,
  getUserFeed,
  getUserPosts,
  getUserProfileByUsername,
  checkFollowing,
  unfollow,
  follow,
} = require("../controllers/user");
const {
  addFeed,
  getFeedByFollow,
  getFeeds,
  like,
  unLike,
  getComments,
  addComment,
} = require("../controllers/feed");

// Middlewares
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.get("/users", getUsers);
router.get("/user-profile", auth, getUserProfile);
router.get("/user-profile/:username", getUserProfileByUsername);
router.patch("/user/:id", auth, uploadFile("image"), editUser);
router.delete("/user/:id", deleteUser);
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.post("/follow/:id", auth, follow);
router.delete("/Unfollow/:id", auth, unfollow);
router.get("/checkFollowing/:id", auth, checkFollowing);
router.get("/user-feeds/:id", auth, getUserFeeds);
router.get("/user-feed/:id", getUserFeed);
router.get("/user-posts/:username", getUserPosts);

router.post("/feed", auth, uploadFile("image"), addFeed);
router.get("/feeds/:id", auth, getFeedByFollow);
router.get("/feeds", getFeeds);
router.post("/like", auth, like);
router.delete("/unlike", auth, unLike);
router.get("/comments/:id", auth, getComments);
router.post("/comment", auth, addComment);

module.exports = router;
