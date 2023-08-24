const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  content: String,
});

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
