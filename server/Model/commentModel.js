const mongoess = require("mongoose");

const commentSchema = mongoess.Schema(
  {
    commenterId: {
      type: mongoess.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    content: { type: String, require: true },
    postId: {
      type: mongoess.Schema.Types.ObjectId,
      require: true,
      ref: "post",
    },
  },
  { timestamps: true }
);

const CommentModel = mongoess.model("comment", commentSchema);

module.exports = { CommentModel };
