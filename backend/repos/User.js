const { UserModel } = require("../models/User");
const { DEFAULT_RESULTS_LIMIT } = require("../lib/constants");

/**
 * Get one user by email while signup
 */
const getByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

/**
 * Find one user by email and password while signin
 */
const getByEmailAndPassword = async ({ email, password }) => {
  return await UserModel.findOne({ email, password });
};

/**
 * Find one user by id while authenticating a user via JWT token
 */
const getById = async (id) => {
  return await UserModel.findOne({ _id: id });
};

/**
 * Create a user while signup
 */
const create = async (payload) => {
  return await UserModel.create(payload);
};

/**
 * Update a user with its profile data
 */
const update = async (id, payload) => {
  return await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

module.exports = {
  getByEmail,
  getByEmailAndPassword,
  getById,
  create,
  update,
};
