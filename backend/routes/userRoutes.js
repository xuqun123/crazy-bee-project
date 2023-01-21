const passport = require("passport");
const router = require("express").Router();
const userController = require("../controllers").userController;

router.get("/me", passport.authenticate("jwt", { session: false }), function (req, res) {
  res.json(req.user);
});

router.get("/:id", function (req, res) {
  userController.getUser(req, res);
});

router.patch("/:id", passport.authenticate("jwt", { session: false }), function (req, res) {
  userController.updateUser(req, res);
});

module.exports = router;
