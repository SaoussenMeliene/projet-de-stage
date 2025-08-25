// Routes/challenge.routes.js (CommonJS)
const express = require("express");
const {
  listChallenges,
  getChallengeStats,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
} = require("../Controllers/challenge.controller");
const verifyToken = require("../Middleware/auth");
const isAdmin = require("../Middleware/isAdmin");

const router = express.Router();

router.get("/", listChallenges);
router.get("/stats", getChallengeStats);
router.get("/:id", getChallengeById);
router.post("/", createChallenge);
router.put("/:id", verifyToken, isAdmin, updateChallenge); // Route pour modifier un défi (admin seulement)
router.delete("/:id", verifyToken, isAdmin, deleteChallenge); // Route pour supprimer un défi (admin seulement)
router.post("/:id/join", joinChallenge);
router.post("/:id/leave", leaveChallenge);

module.exports = router;


