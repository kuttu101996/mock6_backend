const mongoose = require("mongoose");


const blogSchema = mongoose.Schema({
  username: String,
  title: String,
  content: String,
  category: { type: String, enum: ["Entertainment", "Tech"] },
  date: { type: Date, default: Date.now() },
  likes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
