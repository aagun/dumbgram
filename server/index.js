require("dotenv").config();
const router = require("./src/routes");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // we must define cors because our client and server have diffe
  },
});
require("./src/socket")(io);

const PORT = 3030;

app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

server.listen(PORT, () => console.log(`Listenin on port: ${PORT}`));
