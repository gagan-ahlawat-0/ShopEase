const express = require("express");
const upload = require('../config/multer-config')
const {updateUserProfile, getUserProfile, changePassword} = require("../controllers/user-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, upload.single("profileImage"), updateUserProfile);
router.put("/changepassword", auth, changePassword);

module.exports = router;