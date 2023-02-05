require("dotenv").config();
const axios = require("axios");

const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

const pinJSONToIPFS = async (jsonData) => {
  //POST request to Pinata API to pin JSON to IPFS

  return axios
    .post(url, jsonData, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

const generateNFTMetadataToPinata = async (name, assetUrl, description) => {
  const metadata = new Object({ name, image: assetUrl, description });

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      message: "😢 Something went wrong while uploading your NFT metadata to Pinata!",
    };
  }

  return {
    success: true,
    pinataUrl: pinataResponse.pinataUrl,
  };
};

module.exports = { pinJSONToIPFS, generateNFTMetadataToPinata };
