const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const allData = await User.find();
    return res.status(200).json({ msg: "success", data: allData });
  } catch (error) {
    return res.status(400).json({ msg: "Catch Block", data: error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.find({ email });
    if (!findUser) {
      return res.status(400).send({ msg: "No user exist with this email id" });
    }

    bcrypt.compare(password, findUser[0].password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userID: findUser[0]._id },
          process.env.secret_key
        );
        res.cookie("token", token);
        return res.status(200).json({ msg: "Login Successful", token });
      }
    });
  } catch (error) {
    return res.status(400).send({ msg: "Catch block", error });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existCheck = await User.find({ email: email });
    if (existCheck.length > 0) {
      return res.status(400).send({ msg: "User exist with this email id" });
    }
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        return res.status(400).send({ msg: err });
      }
      const newUser = new User({ name, email, password: hash });
      await newUser.save();

      return res
        .status(200)
        .send({ msg: "Registration Successful", data: newUser });
    });
  } catch (error) {
    return res.status(400).send({ msg: error });
  }
});

module.exports = userRouter;
