const User = require("../models/user.model");
const jwt = require("jsonwebtoken")

require("dotenv").config();
const authentication = (req, res, next) => {
  // const token = req.cookies.token;
const token = req.headers.authorization
  try {
    jwt.verify(token, process.env.secret_key, async function (err, decoded) {
      if (err) {
        return res.send({ msg: "Error while verify token", err });
      }
      req.user = await User.findById(decoded.userID).select("-password");
      next();
    });
  } catch (error) {
    return res.send({
      msg: "This is a protected route, you need to login first",
    });
  }
};

module.exports = { authentication };
