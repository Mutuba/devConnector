const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
//get current user profile
//private
//GET api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    //get profile instance from db.
    // pull along user's name and avatar
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile this user"
      });
    }
    //return a jsonified user profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//POST request to api/profile
//create and update profile
router.post(
  "/",
  [
    auth,
    [
      check("status","Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
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
  }
);
module.exports = router;
