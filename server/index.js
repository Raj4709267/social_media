const express = require("express");
const cors = require("cors");
const { userRoutes } = require("./Routes/user.routes");
const { connection } = require("./config/db");
require("dotenv").config();
const socketIO = require("socket.io");
const { chatRoutes } = require("./Routes/chat.routes");
const { messageRoute } = require("./Routes/message.routes");
const { postRoutes } = require("./Routes/post.routes");
const { commentRoutes } = require("./Routes/comment.routes");
const { authentication } = require("./Middleware/Authentication");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "welcome" });
});

app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoute);
app.use("/post", authentication, postRoutes);
app.use("/comment", authentication, commentRoutes);

const server = app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.log("erorr while connecting db");
    console.log(err);
  }
  console.log("app running on " + PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

let activeUsersArray = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  //when user first time make connection to socket;
  socket.on("setup", (userData) => {
    console.log(
      `user ${userData.userId} with socket id ${socket.id} connecting to socket`
    );
    socket.join(userData.userId);
    const userPresent = activeUsersArray.filter(
      (item) => item.userId === userData.userId
    );
    if (userPresent.length === 0) {
      activeUsersArray.push({ userId: userData.userId, socketId: socket.id });
    } else {
      activeUsersArray.forEach((item) => {
        if (item.userId === userData.userId) {
          item.socketId = socket.id;
        }
      });
    }
    console.log("activeUsersArray", activeUsersArray);
    io.emit("getActiveUsers", activeUsersArray);
  });

  socket.on("typing", (users) => {
    const reciverId = activeUsersArray.filter(
      (item) => item.userId === users.friendId
    );

    if (reciverId[0]) {
      socket.in(reciverId[0].socketId).emit("userTyping", users);
    }
  });

  socket.on("stoppedTyping", (users) => {
    const reciverId = activeUsersArray.filter(
      (item) => item.userId === users.friendId
    );
    if (reciverId[0]) {
      socket.in(reciverId[0].socketId).emit("userStoppedTyping", users);
    }
  });

  //when user send message to other user;
  socket.on("new message", (message) => {
    const reciverId = activeUsersArray.filter(
      (item) => item.userId === message.userId
    );
    if (reciverId[0]) {
      socket.in(reciverId[0].socketId).emit("recived message", message);
    }
  });

  //when user logout manually;
  socket.on("logout", () => {
    // Find the user in the activeUsersArray and remove them
    console.log("Client logout");
    activeUsersArray = activeUsersArray.filter(
      (item) => item.socketId !== socket.id
    );
    io.emit("getActiveUsers", activeUsersArray);
  });

  //wher user is diconnect or close the tab;
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    activeUsersArray = activeUsersArray.filter(
      (item) => item.socketId !== socket.id
    );
    io.emit("getActiveUsers", activeUsersArray);
  });
});
