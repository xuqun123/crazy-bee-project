const { NFTCollectionModel } = require("../models/NFTCollection");

/**
 * Get one nftCollection
 */
const getOne = async ({ name, _id }) => {
  let filter = {};
  if (name) filter = { ...filter, name };
  if (_id) filter = { ...filter, _id };

  // find the latest one record for a specific nftCollection
  const nftCollection = await NFTCollectionModel.findOne(filter).sort({ createdAt: -1 }).exec();
  return nftCollection;
};

/**
 * Get multiple nftCollections
 */
const getMany = async ({ name, _id }) => {
  let filter = {};
  if (name) filter = { ...filter, name };

  const nftCollections = await NFTCollectionModel.find(filter).sort({ createdAt: -1 }).exec();
  return nftCollections;
};

/**
 * Create a nftCollection
 */
const create = async (payload) => {
  return await NFTCollectionModel.create(payload);
};

/**
 * Update a nftCollection
 */
const update = async (id, payload) => {
  return await NFTCollectionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

/**
 * Delete a nftCollection
 */
const _delete = async (id) => {
  return await NFTCollectionModel.findByIdAndDelete(id);
};

module.exports = {
  getOne,
  getMany,
  create,
  update,
  delete: _delete,
};
