const router = require("express").Router();
const assetController = require("../controllers").assetController;

router.get("/", (req, res) => {
  assetController.getAssets(req, res);
});

router.get("/:id", (req, res) => {
  assetController.getAsset(req, res);
});

module.exports = router;
