const StatusCodes = require("http-status-codes");
const { create } = require("../lib/aiArtGenerator");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;

// get Assets
const createAIArt = (req, res) => {
  const { text } = req.body;

  create(text)
    .then((data) => res.status(OK).json(data))
    .catch((error) => res.status(BAD_REQUEST).json({ error: error.message }));
};

module.exports = {
  createAIArt,
};
