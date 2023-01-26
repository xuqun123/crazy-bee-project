const StatusCodes = require("http-status-codes");
const assetRepo = require("../repos/Asset");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;

// get Assets
const getAssets = (req, res) => {
  const query = req.query;
  let payload = {};

  if (query?.userId) payload = { ...payload, userId: query.userId };
  if (query?.nftCollectionId) payload = { ...payload, nftCollectionId: query.nftCollectionId };
  if (query?.limit) payload = { ...payload, limit: Number(query.limit) };
  if (query?.offset) payload = { ...payload, offset: Number(query.offset) };

  assetRepo
    .getMany(payload)
    .then(([data, totalCount, offset, loadMore]) =>
      res.status(OK).json({ data, totalCount, offset, loadMore })
    )
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// get one Asset
const getAsset = (req, res) => {
  const params = req.params;

  assetRepo
    .getOne({ _id: params?.id })
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

module.exports = {
  getAssets,
  getAsset,
};
