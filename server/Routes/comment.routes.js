const {
  getComments,
  addComments,
} = require("../Controller/comment.controller");

const commentRoutes = require("express").Router();

commentRoutes.get("/:postId", getComments);
commentRoutes.post("/add", addComments);

module.exports = { commentRoutes };
