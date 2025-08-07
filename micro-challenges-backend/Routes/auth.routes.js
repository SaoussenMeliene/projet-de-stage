const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, checkUsername, checkEmail } = require("../Controllers/auth.controller");
const { handleProfileImageUpload } = require("../Middleware/upload");

router.post("/register", handleProfileImageUpload, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Routes de vérification pour l'inscription
router.get("/check-username/:username", checkUsername);
router.get("/check-email/:email", checkEmail);

module.exports = router;
