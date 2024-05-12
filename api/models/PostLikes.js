const mongoose = require("mongoose");

const PostLikeSchema = new mongoose.Schema({
  postId: {
    // for each post store user.
    type: String,
    required: true,
  },
  users: {
    // user list in string.
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("PostLike", PostLikeSchema);
