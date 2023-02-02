const router = require("express").Router();
const aiCreatorController = require("../controllers").aiCreatorController;

router.post("/", (req, res) => {
  aiCreatorController.createAIArt(req, res);
});

module.exports = router;
