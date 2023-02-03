require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");

const deepAIBaseUrl = "https://api.deepai.org/api";

const create = async (text, generatorStyle = "cute-creature-generator") => {
  var form = new FormData();
  form.append("grid_size", 1);
  form.append("text", text);

  // ********** uncomment the following lines for testing the UI behaviours **********
  // await new Promise((resolve) => setTimeout(resolve, 1500));
  // return Promise.resolve({
  //   data: {
  //     id: "15988ffa-45e3-4ecb-b95c-5516e9da51db",
  //     output_url:
  //       "https://trello.com/1/cards/63b4ad074e70b901c5c3a35e/attachments/63d0bf2970e54a0a5a92ae48/download/image.png",
  //   },
  // });
  // ********** end of testing code **********

  return axios.post(`${deepAIBaseUrl}/${generatorStyle}`, form, {
    headers: {
      "api-key": process.env.DEEPAI_API_KEY,
    },
    // 60s timeout as this API could take ages to return a generated AI art
    timeout: 1000 * 60,
  });
};

module.exports = { create };
