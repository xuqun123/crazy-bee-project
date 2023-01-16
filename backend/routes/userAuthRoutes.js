const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// set 1 day expire time for JWT token
const expiresIn = 1 * 24 * 60 * 60;

router.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: err?.message || "incorrect credentials",
        user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const { _id: id, email } = user;
      const token = jwt.sign({ id, email }, "your_jwt_secret", { expiresIn });
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
