const { AssetModel } = require("../models/Asset");
const { DEFAULT_RESULTS_LIMIT } = require("../lib/constants");

/**
 * Get one asset
 */
const getOne = async ({ _id }) => {
  let filter = {};
  if (_id) filter = { ...filter, _id };

  // find the latest one record for a specific asset
  const asset = await AssetModel.findOne(filter).sort({ publishedAt: -1 }).exec();

  return asset;
};

/**
 * Get multiple assets
 */
const getMany = async ({
  name,
  userId,
  nftCollectionId,
  offset = 0,
  limit = DEFAULT_RESULTS_LIMIT,
}) => {
  let filter = {};
  if (userId) filter = { ...filter, userId };
  if (nftCollectionId) filter = { ...filter, nftCollectionId };

  const totalCount = await AssetModel.countDocuments(filter);
  const loadMore = offset + limit < totalCount;

  const assets = await AssetModel.find(filter)
    .sort({ publishedAt: -1 })
    .skip(offset)
    .limit(limit)
    .exec();

  return Promise.resolve([assets, totalCount, offset, loadMore]);
};

/**
 * Create a nftCollection
 */
const create = async (payload) => {
  return await AssetModel.create(payload);
};

module.exports = {
  getOne,
  getMany,
  create,
};
