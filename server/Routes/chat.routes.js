const express = require("express");
const { createChat, getChats } = require("../Controller/chat.controller");
const { authentication } = require("../Middleware/Authentication");

const chatRoutes = express.Router();

chatRoutes.post("/create", authentication, createChat);
chatRoutes.get("/", authentication, getChats);

module.exports = { chatRoutes };
