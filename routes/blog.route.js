const express = require("express");
const { authentication } = require("../middlewares/authentication");
const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

const blogRouter = express.Router();

blogRouter.get("/", authentication, async (req, res) => {
  //   try {
  //     const data = await Blog.find();
  //     return res.send({ msg: "Success", data });
  //   }
  try {
    let allData = await Blog.find().populate('comments');
    const category = req.query.category;
    const sort = req.query.sort;
    const order = req.query.order;
    const search = req.query.title;

    if (category) {
      let data = await Blog.find({ category: category }).populate('comments');
      if (data) return res.status(200).json({mag: "Filtered Data", data });
    }

    if (sort && order) {
      if (order === "asc") {
        allData = allData.sort((a, b) => a.date - b.date);
      } else if (order === "desc") {
        allData = allData.sort((a, b) => b.date - a.date);
      }
      return res.status(400).json({ msg: "Sorted Data", data: allData });
    }

    if (search) {
      let keyword = { name: { $regex: req.query.title, $options: "i" } };
      let data = await Blog.find(keyword).populate('comments');
      if (data) return res.status(200).json({ msg: "Searched Data", data });
    }

    return res.status(200).json({msg: "Success", data: allData });
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

blogRouter.post("/", authentication, async (req, res) => {
  const data = req.body;
  try {
    data.username = req.user.name;
    const newBlog = new Blog(data);
    await newBlog.save();

    return res.send({ msg: "Created successfully", newBlog });
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

blogRouter.patch("/:id", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const updating = await Blog.findByIdAndUpdate(id, data);
    if (updating) return res.send({ msg: "Success", updating });
    else return res.send({ msg: "unable to update the data" });
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

blogRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleting = await Blog.findByIdAndDelete(id);
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

blogRouter.patch("/:id/like", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    blog.likes += 1;
    await blog.save();

    return res.send({ msg: "Success", likes: blog.likes });
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

blogRouter.patch("/:id/comment", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    let comm = {
      user: req.user._id,
      username: req.user.name,
      content: req.body.content,
    };
    const newComment = new Comment(comm);
    await newComment.save();

    // const blog = await Blog.findById(id)
    // blog.comments.push(newComment._id)
    // await blog.save()

    const commenting = await Blog.findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    return res.send({ msg: "Success", data: commenting });
  } catch (error) {
    res.send({ msg: "Catch block", error });
  }
});

module.exports = blogRouter;
