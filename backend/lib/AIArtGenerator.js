require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");

const deepAIBaseUrl = "https://api.deepai.org/api";

const create = (text, generatorStyle = "cute-creature-generator") => {
  var form = new FormData();
  form.append("grid_size", 1);
  form.append("text", text);

  return axios.post(`${deepAIBaseUrl}/${generatorStyle}`, form, {
    headers: {
      "api-key": process.env.DEEPAI_API_KEY,
    },
    // 60s timeout as this API could take ages to return a generated AI art
    timeout: 1000 * 60,
  });
};

module.exports = { create };
