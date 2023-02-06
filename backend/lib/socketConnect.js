require("dotenv").config();
const io = require("socket.io");

const startSocketServer = (http) => {
  const ioInstance = io(http, {
    cors: {
      origin: process.env.REACT_APP_URL || "http://localhost:3001",
    },
  });
  console.log(`Socket server is listening on port ${process.env.port || 3000}!`);

  ioInstance.on("connection", (socket) => {
    console.log(`[socket] ${socket.id} user is just connected.`);

    socket.on("disconnect", () => {
      console.log("[socket] A user is disconnected.");
    });

    setInterval(() => {
      const number = parseInt(Math.random() * 10);
      console.log("emitting number", number);
      socket.emit("number", number);
    }, 1000);
  });
};

module.exports = startSocketServer;
