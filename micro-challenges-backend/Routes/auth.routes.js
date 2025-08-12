const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../Controllers/auth.controller");
const { handleProfileImageUpload } = require("../Middleware/upload");

router.post("/register", handleProfileImageUpload, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
