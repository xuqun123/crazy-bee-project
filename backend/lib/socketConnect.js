require("dotenv").config();
const io = require("socket.io");

const startSocketServer = (app, http) => {
  const ioInstance = io(http, {
    cors: {
      origin: "*",
    },
  });
  console.log(`Socket server is listening on port ${process.env.port || 3000}!`);
  // set a global 'socketio' instance to the app server
  app.set("socketio", ioInstance);

  ioInstance.on("connection", (socket) => {
    console.log(`[socket] ${socket.id} user is just connected.`);

    socket.on("disconnect", () => {
      console.log("[socket] A user is disconnected.");
    });

    socket.on("assetOrCollectionCreated", (msg) => {
      console.log("[socket] 'assetOrCollectionCreated' event received: " + JSON.stringify(msg));

      console.log(`[socket] brocasting to all clients except for the sender: ${socket.id}`);
      socket.broadcast.emit("assetOrCollectionCreated", msg);
    });
  });
};

module.exports = { startSocketServer };
