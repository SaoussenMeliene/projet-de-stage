// Routes/challenge.routes.js (CommonJS)
const express = require("express");
const {
  listChallenges,
  getChallengeStats,
  getChallengeById,
  createChallenge,
  joinChallenge,
  leaveChallenge,
} = require("../Controllers/challenge.controller");

const router = express.Router();

router.get("/", listChallenges);
router.get("/stats", getChallengeStats);
router.get("/:id", getChallengeById);
router.post("/", createChallenge);
router.post("/:id/join", joinChallenge);
router.post("/:id/leave", leaveChallenge);

module.exports = router;


