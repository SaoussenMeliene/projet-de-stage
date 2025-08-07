const express = require("express");
const router = express.Router();
const messageCtrl = require("../Controllers/message.controller");
const verifyToken = require("../Middleware/auth");
const upload = require("../Middleware/upload"); // Pour les fichiers (images, vidéos)

// POST : Envoyer un message dans un group

router.post("/group/:groupId", verifyToken, messageCtrl.sendMessage);

// GET : Récupérer tous les messages d’un group

router.get("/group/:groupId", verifyToken, messageCtrl.getMessagesByGroup);

module.exports = router;
