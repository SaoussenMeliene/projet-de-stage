const express = require("express");
const router = express.Router();
const pollCtrl = require("../Controllers/poll.controller");
const verifyToken = require("../Middleware/auth");

// ===== ROUTES POUR SONDAGES DE DÉFIS =====
//  Créer un sondage dans un défi
router.post("/challenge/:challengeId", verifyToken, pollCtrl.createPoll);

// ===== ROUTES POUR SONDAGES DE GROUPES =====
//  Créer un sondage dans un groupe
router.post("/group/:groupId", verifyToken, pollCtrl.createGroupPoll);

//  Récupérer tous les sondages d'un groupe
router.get("/group/:groupId", verifyToken, pollCtrl.getGroupPolls);

// ===== ROUTES COMMUNES =====
//  Voter sur un sondage (défi ou groupe)
router.post("/:pollId/vote", verifyToken, pollCtrl.vote);

//  Voir résultats d'un sondage
router.get("/:pollId", verifyToken, pollCtrl.getPollResults);

//  Clôturer un sondage
router.patch("/:pollId/close", verifyToken, pollCtrl.closePoll);

module.exports = router;
