const express = require("express");
const router = express.Router();
const pollCtrl = require("../Controllers/poll.controller");
const verifyToken = require("../Middleware/auth");

//  Créer un sondage
router.post("/:challengeId", verifyToken, pollCtrl.createPoll);

//  Voter
router.post("/:pollId/vote", verifyToken, pollCtrl.vote);

//  Voir résultats
router.get("/:pollId", verifyToken, pollCtrl.getPollResults);

//  Clôturer
router.patch("/:pollId/close", verifyToken, pollCtrl.closePoll);

module.exports = router;
