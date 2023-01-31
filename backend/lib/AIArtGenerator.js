const deepai = require("deepai");

const create = (text) => {
  //deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");
  deepai.setApiKey("7fec5eb0-443c-4a9f-95f4-29dbf032e820");
  console.log(text);
  return (
    deepai
      .callStandardApi("text2img", { text: String })
      //return Promise.resolve({ output: "image url here" })
      .then((data) => {
        console.log("test", data);
        return data;
      })
      .catch((error) => {
        //   console.log(error);
        return error;
      })
  );
};

module.exports = { create };
