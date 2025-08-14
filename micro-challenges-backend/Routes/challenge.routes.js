const express = require("express");
const router = express.Router();
const {
  listChallenges,
  getChallengeStats,
  createChallenge
} = require("../Controllers/challenge.controller");
// const verifyToken = require("../Middleware/auth"); // si tu veux protéger la création

// liste + filtres + recherche + tri + pagination
router.get("/", listChallenges);

// stats (all, active, upcoming, completed)
router.get("/stats", getChallengeStats);

// création (optionnel pour tester)
router.post("/", /* verifyToken, */ createChallenge);

module.exports = router;

