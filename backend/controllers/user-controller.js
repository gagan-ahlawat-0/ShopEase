const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:user-controller");

module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      address: user.address,
      profileImage: user.profileImage,
    });
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, contactNo, address } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.contactNo = contactNo || user.contactNo;
    user.address = address || user.address;

    if (req.file) {
      user.profileImage = req.file.path; 
    }

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      address: user.address,
      profileImage: user.profileImage,
    });
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
