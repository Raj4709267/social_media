const express = require("express");
const { authentication } = require("../Middleware/Authentication");
const { allMessages, addMessage } = require("../Controller/message.controller");

const messageRoute = express.Router();

messageRoute.get("/:chatId", authentication, allMessages);
messageRoute.post("/send", authentication, addMessage);

module.exports = { messageRoute };
