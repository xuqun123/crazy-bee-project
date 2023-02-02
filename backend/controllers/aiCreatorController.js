const StatusCodes = require("http-status-codes");
const aiArtGenerator = require("../lib/aiArtGenerator");
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;

const createAIArt = (req, res) => {
  const { text, style } = req.body;

  aiArtGenerator
    .create(text, style || "cute-creature-generator")
    .then((response) => {
      console.log(
        `[DeepAI] Successfully generated an AI art from '${text}' (${style}):`,
        response?.data || response
      );

      res.status(OK).json(response?.data);
    })
    .catch((error) => {
      const errMsg = error?.response?.data?.status || error.message;
      console.log(`[DeepAI] Failed to generate an AI art from '${text}' (${style}):`, errMsg);

      res.status(BAD_REQUEST).json({ error: errMsg });
    });
};

module.exports = {
  createAIArt,
};
