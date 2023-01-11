require("dotenv").config();
const mongoose = require("mongoose");
const { NFTCollectionModel, collectionTypes, statuses } = require("../models/NFTCollection");
const { createFakeNFTCollection } = require("../lib/fakeDataHelper");

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB!\n");

    const fakeData = Array.from({ length: 50 }, (_) => createFakeNFTCollection());
    NFTCollectionModel.insertMany(fakeData)
      .then((result) => {
        console.log("Data inserted:", result);
        process.exit(1);
      })
      .catch((error) => {
        console.error(`Failed to seed nftCollections data`, error);
        process.exit(1);
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
