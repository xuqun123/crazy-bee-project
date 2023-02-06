require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {check} = require('express-validator');

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

router.post('/recover', [
  check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);

module.exports = router;
