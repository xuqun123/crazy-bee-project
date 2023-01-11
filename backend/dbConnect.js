// mongoDB connection
const mongoClient = require("mongodb").MongoClient;

// add database connection
const uri = process.env.MONGODB_URL;
const client = new mongoClient(uri, { useNewUrlParser: true });

client.connect((err, db) => {
  if (!err) {
    console.log("MongoDB connected!");
  } else {
    console.log("MongoDB connection error!");
    process.exit(1);
  }
});

module.exports = client;
