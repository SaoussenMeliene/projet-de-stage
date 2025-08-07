const express = require("express");
const router = express.Router();
const challengeCtrl = require("../Controllers/challenge.controller");
const verifyToken = require("../Middleware/auth");

router.get("/", verifyToken, challengeCtrl.getChallenges);
router.post("/", verifyToken, challengeCtrl.createChallenge);

module.exports = router;
