const router = require("express").Router();
const nftCollectionController = require("../controllers").nftCollectionController;

router.get("/", (req, res) => {
  nftCollectionController.getNFTCollections(req, res);
});

router.get("/:id", (req, res) => {
  nftCollectionController.getNFTCollection(req, res);
});

router.post("/", (req, res) => {
  nftCollectionController.createNFTCollection(req, res);
});

router.patch("/:id", (req, res) => {
  nftCollectionController.updateNFTCollection(req, res);
});

router.delete("/:id", (req, res) => {
  nftCollectionController.deleteNFTCollection(req, res);
});

module.exports = router;
