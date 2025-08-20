const express = require("express");
const router = express.Router();
const participantCtrl = require("../Controllers/participant.controller");
const verifyToken = require("../Middleware/auth");

// POST: Rejoindre un défi
router.post("/join/:challengeId", verifyToken, participantCtrl.joinChallenge);

// DELETE: Quitter un défi
router.delete("/leave/:challengeId", verifyToken, participantCtrl.leaveChallenge);

// GET: Obtenir les participants d'un défi
router.get("/challenge/:challengeId", participantCtrl.getChallengeParticipants);

// GET: Obtenir les participations d'un utilisateur
router.get("/my-participations", verifyToken, participantCtrl.getUserParticipations);

module.exports = router;
