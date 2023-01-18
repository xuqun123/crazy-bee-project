const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  await mongoose.disconnect();

  memoryServer = await MongoMemoryServer.create();

  const mongoUri = await memoryServer.getUri();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await memoryServer.stop();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = { connect, closeDB, clearDB };
