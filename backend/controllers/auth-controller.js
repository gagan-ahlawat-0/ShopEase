const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const debug = require("debug")("app:auth-controller");
const setAuthCookie = require("../utils/setAuthCookie");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    debug("✅ User registered:", user.email);
    res.status(201).json({
      message: "Registration successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    debug("Register Error:", error.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    debug("✅ User logged in:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    debug("Login Error:", error.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
