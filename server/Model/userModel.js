const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  avatar: { type: String, require: true },
  throughGoogle: { type: Boolean, require: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
