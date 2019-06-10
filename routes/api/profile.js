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
      check("status", "Status is required")
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
    const {
      company,
      website,
      location,
      bio,
      status,
      gihubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    // build profile fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (gihubusername) profileFields.gihubusername = gihubusername;
    if (skills) {
      // build a skills array object and push in a coma separated list with no irrelevant spaces
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    // console.log(profileFields.social);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create coz there was no existing profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    // res.send("Hello");
  }
);
//get all profiles
// GET api/profiles and public
router.get("/", async (req, res) => {
  try {
    //no need to provide an id
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//get profile based on user id
// GET api/profiles/user/:user_id
//public
router.get("/user/:user_id", async (req, res) => {
  try {
    //no need to provide an id
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({
        msg: "Profile not found"
      });
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId")
      return res.status(400).json({
        msg: "Profile not found"
      });
    res.status(500).send("Server error");
  }
});

//delete one's profile, user & posts
// DELETE api/profiles and private
router.delete("/", auth, async (req, res) => {
  try {
    //remove user's profile and user and posts
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    await User.findOneAndRemove({
      _id: req.user.id
    });
    return res.json({
      msg: "Profile deleted"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//add one's profile experiences
// DELETE api/profiles/experince and private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
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
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      });
      // Add to exp array the new experience data object
      // push to the biggining of the exp array
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
