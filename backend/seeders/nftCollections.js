require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { NFTCollectionModel, collectionTypes, statuses } = require("../models/NFTCollection");
const { UserModel } = require("../models/User");
const { createFakeNFTCollection } = require("../lib/fakeDataHelper");
const { sample } = require("lodash");

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("Connected to MongoDB!\n");

    const users = await UserModel.find({}).limit(10).exec();
    const fakeData = Array.from({ length: 20 }, (_) => {
      const pickedUser = sample(users);
      return createFakeNFTCollection(false, pickedUser._id);
    });

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
