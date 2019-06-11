const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
// ...rest of the initial code omitted for simplicity.
const auth = require("../../middleware/auth");
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post = new Post(newPost);
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
//GET all posts
// GET api/posts Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log("Server Error");
    res.status(500).send("Server Error");
  }
});

//GET posts by id
// GET api/posts/:post_id Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Post not found"
      });
    console.log("Server Error");
    res.status(500).send("Server Error");
  }
});
//DELETE  post by id
// DELETE api/posts/:id Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // perform post delete by finding post passed in params
    post = await Post.findById({ _id: req.params.id });
    // Check if post is found
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json("Post deleted successfully");
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Post not found"
      });
    console.console.log("Server Error");
    res.status(500).send("Server Error");
  }
});
//PUT  like a post by id
// PUT api/posts/like/:id Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    //get post from the db based on id
    const post = await Post.findById({ _id: req.params.id });
    // Check if post is found
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Post not found"
      });
    console.console.log("Server Error");
    res.status(500).send("Server Error");
  }
});

//PUT  unlike a post by id
// PUT api/posts/unlike/:id Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //get post from the db based on id
    const post = await Post.findById({ _id: req.params.id });
    // Check if post is found
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    const index = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );
    // remove like at found index as the only one denoted by 1
    post.likes.splice(index, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Post not found"
      });
    console.error("Server Error");
    res.status(500).send("Server Error");
  }
});
//POST  comment a post by id
// POST api/posts/comment/:id Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      //get current user by id from the db based on logged in user but strip off the pswd
      const user = await User.findById(req.user.id).select("-password");
      //get the post by id based on the id in params
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      if (error.kind == "ObjectId")
        return res.status(400).json({
          msg: "Post not found"
        });
      console.error("Server Error");
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
