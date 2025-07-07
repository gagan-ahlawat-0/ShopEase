const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const debug = require("debug")("app:isLoggedIn");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please login again." });
    }

    req.user = user;
    next();
  } catch (error) {
    debug("JWT Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
