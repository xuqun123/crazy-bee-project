const router = require("express").Router();

router.get("/me", function (req, res) {
  res.json(req.user);
});

module.exports = router;
