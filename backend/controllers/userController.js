const StatusCodes = require("http-status-codes");
const userRepo = require("../repos/User");
const { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = StatusCodes;

// get one User
const getUser = (req, res) => {
  const params = req.params;

  userRepo
    .getById(params.id)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

// update a User
const updateUser = (req, res) => {
  const { user } = req.body || {};
  const id = req.params.id;

  if (req.user._id != id) {
    return res.status(UNAUTHORIZED).json({ error: "you cannot update other users" });
  }

  if (!user) {
    return res.status(BAD_REQUEST).json({ error: "missing user params" });
  }

  userRepo
    .update(id, user)
    .then((data) => res.status(OK).json({ data }))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

module.exports = {
  getUser,
  updateUser,
};
