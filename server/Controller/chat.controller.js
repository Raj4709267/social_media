const { ChatModel } = require("../Model/chatModel");
const { MessageModel } = require("../Model/messageModel");
const { UserModel } = require("../Model/userModel");

const createChat = async (req, res) => {
  const { friendUserId, userId } = req.body;

  let isChat = await ChatModel.find({
    iSGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: friendUserId } } },
    ],
  }).populate("users", "-password");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = { users: [userId, friendUserId] };
    try {
      const createdChat = await ChatModel.create(chatData);
      const FullChat = await createdChat.populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
const getChats = async (req, res) => {
  try {
    ChatModel.find({ users: { $elemMatch: { $eq: req.body.userId } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name avatar email",
        });

        // Fetch the unread message count for each chat
        const updatedResults = await Promise.all(
          results.map(async (chat) => {
            const unreadCount = await MessageModel.countDocuments({
              chat: chat._id,
              unRead: true,
            });
            return { ...chat._doc, unreadCount };
          })
        );

        res.status(200).send(updatedResults);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { createChat, getChats };
