const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  username: String,
  email: String,
  avatar: String
});

const User = mongoose.model("User", userSchema);
module.exports = User;
