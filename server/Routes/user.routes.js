const express = require("express");
const {
  getUsers,
  loginUsers,
  signupUsers,
} = require("../Controller/user.controller");

const userRoutes = express.Router();

userRoutes.post("/login", loginUsers);
userRoutes.post("/signup", signupUsers);
userRoutes.get("/", getUsers);

module.exports = { userRoutes };
