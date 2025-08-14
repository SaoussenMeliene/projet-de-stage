const express = require("express");
const router = express.Router();
const { checkUsername, checkEmail,getProfile,register, login, forgotPassword, resetPassword } = require("../Controllers/auth.controller");
const { handleProfileImageUpload } = require("../Middleware/upload");

router.post("/register", handleProfileImageUpload, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-username/:username", checkUsername);
router.get("/check-email/:email", checkEmail);

module.exports = router;
