require("dotenv").config();
require("./mongooseConnect");
require("./lib/userAuth");
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const startSocketServer = require("./lib/socketConnect");
const userAuthRoutes = require("./routes/userAuthRoutes");
const nftCollectionRoutes = require("./routes/nftCollectionRoutes");
const assetRoutes = require("./routes/assetRoutes");
const userRoutes = require("./routes/userRoutes");
const aiCreatorRoutes = require("./routes/aiCreatorRoutes");

const app = express();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/nftCollections", nftCollectionRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/aiCreator", aiCreatorRoutes);

app.get("/", (req, res) => {
  res.send("the backend server is running now...");
});

startSocketServer(http);

http.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});

module.exports = app;
