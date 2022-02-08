const { comment, user, profile } = require("../../models");
const jwt = require("jsonwebtoken");

const connectedUser = {};

const socketIo = (io) => {
  // create middlewares before connection event
  // to prevent client access socket server without token
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("client connect: ", socket.id);

    const feedId = socket.handshake.query.id;
    connectedUser[feedId] = socket.id;

    socket.on("load comments", async (payload) => {
      try {
        console.log(payload);
        console.log("aku adalah payload", payload.id);
        const data = await comment.findAll({
          where: {
            feedId: payload,
          },
          attributes: ["comment"],
          include: {
            model: user,
            as: "user",
            attributes: ["username"],
            include: {
              model: profile,
              as: "profile",
              attributes: ["image"],
            },
          },
        });
        socket.emit("comments", data);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("send comment", async (payload) => {
      try {
        const response = await comment.create({
          userId: payload.userId,
          feedId: payload.feedId,
          comment: payload.comment,
        });

        io.to(socket.id).to(connectedUser[feedId]).emit("new comment", feedId);
      } catch (err) {}
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
      delete connectedUser[feedId];
    });
  });
};

module.exports = socketIo;
