require("dotenv").config();
// require("./dbConnect");
require("./mongooseConnect");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const nftCollectionRoutes = require("./routes/nftCollectionRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/nftCollections", nftCollectionRoutes);

app.get("/", (req, res) => {
  res.send("the backend server is running now...");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
