const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    content: { type: String, trim: true, require: true },
    image: { type: String, trim: true, require: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat", require: true },
    unRead: { type: Boolean, require: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("message", messageSchema);

module.exports = { MessageModel };
