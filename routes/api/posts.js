const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
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
  async function(req, res) {
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

    if (
      // check if user already dislikes the post and remove from dislikes
      post.dislikes.filter(dislike => dislike.user.toString() === req.user.id)
        .length > 0
    ) {
      // add the user as dislikes to the start of the array
      const index = post.dislikes.findIndex(
        dislike => dislike.user.toString() === req.user.id
      );
      // remove from likes coz the user is unliking by clicking on like if already liked
      post.dislikes.splice(index, 1);
      await post.save();
      // res.json(post.dislikes);
    }
    //check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      //like exist already get it's index
      const index = post.likes.findIndex(
        like => like.user.toString() === req.user.id
      );
      // remove from likes coz the user is unliking by clicking on like if already liked
      post.likes.splice(index, 1);
      await post.save();
      res.json(post.likes);
    }
    // {
    //   return res.status(400).json({ msg: "Post already liked" });
    // }
    // add the user as likes to the start of the array
    else {
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    }
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Post not found"
      });
    console.error("Server Error");
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

    // check if user likes the post and remove user from likes array
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      //like exist already get it's index
      const index = post.likes.findIndex(
        like => like.user.toString() === req.user.id
      );
      // remove from likes coz the user is unliking by clicking on like if already liked
      post.likes.splice(index, 1);
      await post.save();
      // res.json(post.likes);
    }
    //check if post has already been disliked
    if (
      // using filter returns an array hence possible to call length() unlike find() method
      post.dislikes.filter(dislike => dislike.user.toString() === req.user.id)
        .length === 0
    ) {
      // add the user as dislikes to the start of the array
      post.dislikes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.dislikes);
    } else {
      const index = post.dislikes.findIndex(
        dislike => dislike.user.toString() === req.user.id
      );
      // remove dislike at found index as the only one denoted by 1
      post.dislikes.splice(index, 1);
      await post.save();
      res.json(post.dislikes);
    }
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

//DELETE  comment on a post by id
// DELETE api/posts/comment/:id/:comment_id Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    // check if post exists in the database
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //get a comment by id based on returned post
    //find() is cheap as it stops at first match and returns a comment object
    const comment = post.comments.find(
      comment => comment.id == req.params.comment_id
    );
    // return not found if no comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    // check if user is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    // get index of the comment so as to remove
    // get by id and not by use_id as one user can post multiple comments
    const index = post.comments.findIndex(
      comment => comment.id === req.params.comment_id
    );
    // remove the comment at found index as the only one denoted by 1
    post.comments.splice(index, 1);
    //save the post with updated number of comments
    await post.save();
    res.json(post.comments);
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(404).json({
        msg: "Item not found"
      });
    console.error("Server Error");
    res.status(500).send("Server Error");
  }
});
module.exports = router;
