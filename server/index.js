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
const { MessageModel } = require("./Model/messageModel");
const { ChatModel } = require("./Model/chatModel");

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
    origin: process.env.FRONTEND_URL,
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

  socket.on("open chat", async (chatId, userId) => {
    try {
      // Find all unread messages in the specified chat for the current user
      const unreadMessages = await MessageModel.find({
        chat: chatId,
        sender: { $ne: userId },
        unRead: true,
      });

      if (unreadMessages.length === 0) {
        return; // No unread messages to mark as read
      }

      // Mark all unread messages as read
      await MessageModel.updateMany(
        { _id: { $in: unreadMessages.map((msg) => msg._id) } },
        { $set: { unRead: false } }
      );

      // Update the latestMessage field in the chat
      const latestMessageId = unreadMessages[unreadMessages.length - 1]._id;
      await ChatModel.findByIdAndUpdate(chatId, {
        latestMessage: latestMessageId,
      });

      // Emit an event to notify the user that messages have been marked as read
      socket.emit("messages marked as read");
    } catch (error) {
      // Handle errors
      console.error("Error marking messages as read:", error);
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
