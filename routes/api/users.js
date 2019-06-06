const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
//register user
router.post(
  "/",
  [
    // username cannot be blank
    check("name", "Name is required")
      .not()
      .isEmpty(),
    // must be an email
    check("email", "Please include a valid email address").isEmail(),
    // password must be at least 5 chars long
    check(
      "password",
      "Please enter a password of atleast 6 charecters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // see if user exists
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      user = new User({
        name,
        email,
        password,
        avatar
      });
      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // return json web token
      const payload = {
        user: {
          id: user.id
        }
      };
      // token generation results in a token or an error
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600000
        },
        (err, token) => {
          if (err) throw err;
          // res.status(200).send({ token });
          res.json({ token });
        }
      );
      // let token = await jwt.sign(payload, config.get("jwtSecret"), {
      //   expiresIn: 3600000
      // });
      // if (token) {
      //   res.status(200).send({ token: token });
      // }
      // if (err) {
      //   throw err;
      // }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
