const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "profileDefault.png",
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: Number,
      default: 0
    },
    resetTokenUsed: { type: Boolean, default: false }
  },
  { timestamps: true }//shotcut to store the updatedAt and createdAt time
);

module.exports = mongoose.model("User", UserSchema);