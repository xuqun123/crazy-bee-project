const deepai = require("deepai");

const create = (text) => {
  deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");
  //   console.log(text);
  //   return deepai
  //     .callStandardApi("text2img", { text })
  return Promise.resolve({ output: "image url here" })
    .then((data) => {
      console.log("test", data);
      return data;
    })
    .catch((error) => {
      //   console.log(error);
      return error;
    });
};

module.exports = { create };
