require("dotenv").config();
const mongoose = require("mongoose");
const { UserModel } = require("../models/User");
const { createFakeUser } = require("../lib/fakeDataHelper");

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB!\n");

    const fakeData = Array.from({ length: 10 }, (_) => createFakeUser());
    console.log(fakeData);
    UserModel.insertMany(fakeData)
      .then((result) => {
        console.log("Data inserted:", result);
        process.exit(1);
      })
      .catch((error) => {
        console.error(`Failed to seed users data`, error);
        process.exit(1);
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
