require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// set 1 day expire time for JWT token
const expiresIn = 1 * 24 * 60 * 60;

router.post("/signup", function (req, res) {
  passport.authenticate("local-signup", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        error: err?.message || info?.message,
      });
    }

    return res.json({ user });
  })(req, res);
});

router.post("/login", function (req, res) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        error: err?.message || info?.message,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.json({ message: err?.message });
      }

      const { _id: id, email } = user;
      const token = jwt.sign({ id, email }, process.env.SERVER_JWT_SECRET, { expiresIn });

      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
