const express = require("express");
const router = express.Router();
const participantCtrl = require("../Controllers/participant.controller");
const verifyToken = require("../Middleware/auth");

// POST: Rejoindre un défi
router.post("/join/:challengeId", verifyToken, participantCtrl.joinChallenge);

module.exports = router;
