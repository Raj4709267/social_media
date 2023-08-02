const express = require("express");
const {
  findUsers,
  loginUsers,
  signupUsers,
  updateAvatar,
} = require("../Controller/user.controller");
const { authentication } = require("../Middleware/Authentication");

const userRoutes = express.Router();

userRoutes.get("/", authentication, findUsers);
userRoutes.post("/signup", signupUsers);
userRoutes.post("/login", loginUsers);
userRoutes.post("/update", authentication, updateAvatar);

module.exports = { userRoutes };
