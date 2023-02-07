const StatusCodes = require("http-status-codes");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;
const assetRepo = require("../repos/Asset");
const { buildAssetTokenDetails, uploadToPinataAndMintNFT } = require("../lib/nft/mintNFT");

// get Assets
const getAssets = (req, res) => {
  const query = req.query;
  let payload = {};

  if (query?.userId) payload = { ...payload, userId: query.userId };
  if (query?.nftCollectionId) payload = { ...payload, nftCollectionId: query.nftCollectionId };
  if (query?.name) payload = { ...payload, name: query.name };
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

// create an asset and also mint the asset as a NFT token asynchrously
const createAsset = (req, res) => {
  const receiverAddress = req.body?.receiverAddress?.length > 0 ? req.body?.receiverAddress : null;
  let asset = req.body?.asset;

  if (!asset) {
    return res.status(BAD_REQUEST).json({ error: "missing asset params" });
  }

  // build the token details
  asset = buildAssetTokenDetails(asset, receiverAddress);

  assetRepo
    .create(asset)
    .then((data) => {
      res.status(OK).json({ data });

      if (receiverAddress) {
        const assetId = data._id;

        // uploading the asset data to Pinata as a NFT's metadata asynchronously
        uploadToPinataAndMintNFT(asset, assetId, receiverAddress);
      }
    })
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// update an asset
const updateAsset = (req, res) => {
  const { asset } = req.body || {};
  const id = req.params.id;

  if (!asset) {
    return res.status(BAD_REQUEST).json({ error: "missing asset params" });
  }

  assetRepo
    .update(id, asset)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// delete an asset
const deleteAsset = (req, res) => {
  const id = req.params.id;

  assetRepo
    .delete(id)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
};
