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
  return await UserModel.findById(id);
};

/**
 * Create a user while signup
 */
const create = async (payload) => {
  return await UserModel.create(payload);
};

module.exports = {
  getByEmail,
  getByEmailAndPassword,
  getById,
  create,
};
