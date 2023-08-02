const { ChatModel } = require("../Model/chatModel");
const { MessageModel } = require("../Model/messageModel");
const { UserModel } = require("../Model/userModel");

const allMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const addMessage = async (req, res) => {
  const { content, chatId, image, unRead } = req.body;
  if ((!content && !image) || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  const newMessage = {
    sender: req.body.userId,
    content: content,
    chat: chatId,
    image,
    unRead,
  };

  try {
    let message = await MessageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chats.users",
      select: "name pic email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { allMessages, addMessage };
