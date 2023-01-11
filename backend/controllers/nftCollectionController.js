const StatusCodes = require("http-status-codes");
const NFTCollectionRepo = require("../repos/nftCollection");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;

// get NFTCollections
const getNFTCollections = (req, res) => {
  const body = req.body;

  NFTCollectionRepo.getMany({ name: body?.name })
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// get one NFTCollection
const getNFTCollection = (req, res) => {
  const id = req.params?.id;
  const body = req.body;

  NFTCollectionRepo.getOne({ _id: id, name: body?.name })
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// create a NFTCollection
const createNFTCollection = (req, res) => {
  const { nftCollection } = req.body || {};

  if (!nftCollection) {
    return res.status(BAD_REQUEST).json({ error: "missing nftCollection params" });
  }

  NFTCollectionRepo.create(nftCollection)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// update a NFTCollection
const updateNFTCollection = (req, res) => {
  const { nftCollection } = req.body || {};
  const id = req.params?.id;

  if (!nftCollection || !id) {
    return res.status(BAD_REQUEST).json({ error: "missing nftCollection params" });
  }

  NFTCollectionRepo.update(id, nftCollection)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// delete a NFTCollection
const deleteNFTCollection = (req, res) => {
  const id = req.params?.id;

  if (!id) {
    return res.status(BAD_REQUEST).json({ error: "missing nftCollection params" });
  }

  NFTCollectionRepo.delete(id)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

module.exports = {
  getNFTCollections,
  getNFTCollection,
  createNFTCollection,
  updateNFTCollection,
  deleteNFTCollection,
};
