const StatusCodes = require("http-status-codes");
const nftCollectionRepo = require("../repos/NFTCollection");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;

// get NFTCollections
const getNFTCollections = (req, res) => {
  const query = req.query;
  let payload = {};

  if (query?.name) payload = { ...payload, name: query.name };
  if (query?.userId) payload = { ...payload, userId: query.userId };
  if (query?.limit) payload = { ...payload, limit: Number(query.limit) };
  if (query?.offset) payload = { ...payload, offset: Number(query.offset) };

  nftCollectionRepo
    .getMany(payload)
    .then(([data, totalCount, offset, loadMore]) =>
      res.status(OK).json({ data, totalCount, offset, loadMore })
    )
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// get one NFTCollection
const getNFTCollection = (req, res) => {
  const params = req.params;
  const query = req.query;

  nftCollectionRepo
    .getOne({ _id: params?.id, name: query?.name })
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// create a NFTCollection
const createNFTCollection = (req, res) => {
  const { nftCollection } = req.body || {};

  if (!nftCollection) {
    return res.status(BAD_REQUEST).json({ error: "missing nftCollection params" });
  }

  nftCollectionRepo
    .create(nftCollection)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// update a NFTCollection
const updateNFTCollection = (req, res) => {
  const { nftCollection } = req.body || {};
  const id = req.params.id;

  if (!nftCollection) {
    return res.status(BAD_REQUEST).json({ error: "missing nftCollection params" });
  }

  nftCollectionRepo
    .update(id, nftCollection)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// delete a NFTCollection
const deleteNFTCollection = (req, res) => {
  const id = req.params.id;

  nftCollectionRepo
    .delete(id)
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
