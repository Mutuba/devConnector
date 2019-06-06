const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const router = express.Router();
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//post to api/auth to authenticate and get user token
//public
router.post(
  "/",
  [
    // must be an email
    check("email", "Please include a valid email address").isEmail(),
    // password must be at least 5 chars long
    check("password", "Password is requireed").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // see if user exists
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //check password matchb btwn passed pswd and stored pswd(user.password)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials"
            }
          ]
        });
      }

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
