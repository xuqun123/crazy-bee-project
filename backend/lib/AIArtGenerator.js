require("dotenv").config();
//const deepai = require("deepai");
const axios = require("axios");
const FormData = require("form-data");

// // Previous with Jamie's API key
// const create = (text) => {
//   //deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");
//   deepai.setApiKey("7fec5eb0-443c-4a9f-95f4-29dbf032e820");
//   console.log(text);
//   return (
//     deepai
//       .callStandardApi("text2img", { text: String })
//       //return Promise.resolve({ output: "image url here" })
//       .then((data) => {
//         console.log("test", data);
//         return data;
//       })
//       .catch((error) => {
//         //   console.log(error);
//         return error;
//       })
//   );
// };

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
