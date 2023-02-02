const router = require("express").Router();
const assetController = require("../controllers").assetController;

router.get("/", (req, res) => {
  assetController.getAssets(req, res);
});

router.get("/:id", (req, res) => {
  assetController.getAsset(req, res);
});

router.post("/", (req, res) => {
  assetController.createAsset(req, res);
});

router.patch("/:id", (req, res) => {
  assetController.updateAsset(req, res);
});

router.delete("/:id", (req, res) => {
  assetController.deleteAsset(req, res);
});

module.exports = router;
