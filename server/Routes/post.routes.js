const {
  getAllPost,
  addPost,
  postLike,
  deletePost,
} = require("../Controller/post.controller");

const postRoutes = require("express").Router();

postRoutes.get("/", getAllPost);
postRoutes.post("/add", addPost);
postRoutes.post("/like", postLike);
postRoutes.post("/delete", deletePost);

module.exports = { postRoutes };
