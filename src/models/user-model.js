const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
  },
  profileImageUrl: {
    type: String,
  },
  created: {
    type: Date,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
