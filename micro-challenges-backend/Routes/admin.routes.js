const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/auth");
const isAdmin = require("../Middleware/isAdmin");

// Exemple : créer un challenge (admin seulement)
router.post("/create-challenge", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ msg: "Challenge créé (admin only)" });
});

module.exports = router;
