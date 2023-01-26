require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { UserModel } = require("../models/User");
const { NFTCollectionModel } = require("../models/NFTCollection");
const { AssetModel } = require("../models/Asset");
const { createFakeAsset } = require("../lib/fakeDataHelper");
const { sample } = require("lodash");

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("Connected to MongoDB!\n");

    const users = await UserModel.find({}).limit(10).exec();
    const nftCollections = await NFTCollectionModel.find({}).limit(10).exec();

    const fakeData = Array.from({ length: 50 }, (_) => {
      const pickedUser = sample(users);
      const pickedNFTCollection = sample(nftCollections);
      return createFakeAsset(false, pickedUser._id, pickedNFTCollection._id);
    });

    AssetModel.insertMany(fakeData)
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
