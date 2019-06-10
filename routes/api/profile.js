const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
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
// PUT api/profile/experince and private
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
//delete one's profile experiences
// DELETE api/profile/experince/:exp_id and private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //find or findIndex can return the index
    // const removeIndex = profile.experience
    //   .map(item => item.id)
    //   .indexOf(req.params.exp_id);
    // Better implementation using findIndex method works as above
    const index = profile.experience.findIndex(
      item => item.id === req.params.exp_id
    );
    // remove the experience at found index as the only one denoted by 1
    profile.experience.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {}
});

//add one's profile education
// PUT api/profile/education and private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
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
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;
    const newEduc = {
      school,
      degree,
      fieldofstudy,
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
      profile.education.unshift(newEduc);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);
//delete one's profile education
// DELETE api/profile/education/:educ_id and private
router.delete("/education/:educ_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //find or findIndex can return the index
    // const removeIndex = profile.experience
    //   .map(item => item.id)
    //   .indexOf(req.params.exp_id);
    // Better implementation using findIndex method works as above
    const index = profile.education.findIndex(
      item => item.id === req.params.educ_id
    );
    // remove the experience at found index as the only one denoted by 1
    profile.education.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {}
});
//get user github profile and repos
// GET api/profile/github/:username and public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubClientSecret")} `,
      method: 'GET',
      headers: {
        'user-agent': 'node.js'
      }
    };
    request(options, (error, response, body) => {
      console.log(error);
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        res.status(404).json({ msg: "Github Profile not found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {}
});

module.exports = router;
