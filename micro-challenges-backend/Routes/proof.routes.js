const express = require("express");
const router = express.Router();
const proofCtrl = require("../Controllers/proof.controller");
const verifyToken = require("../Middleware/auth");
const isAdmin = require("../Middleware/isAdmin");

// Route de test
router.get("/test", (req, res) => {
  res.json({ msg: "Routes proof fonctionnelles !" });
});

// POST: Soumettre une preuve pour un défi
router.post("/submit/:challengeId", verifyToken, proofCtrl.uploadMiddleware, proofCtrl.submitProof);

// GET: Obtenir mes preuves (utilisateur connecté)
router.get("/my-proofs", verifyToken, proofCtrl.getMyProofs);

// GET: Obtenir une preuve spécifique
router.get("/:proofId", verifyToken, proofCtrl.getProofById);

// === ROUTES ADMIN ===

// GET: Obtenir les preuves en attente (Admin)
router.get("/admin/pending", verifyToken, isAdmin, proofCtrl.getPendingProofs);

// GET: Obtenir toutes les preuves avec filtres (Admin)
router.get("/admin/all", verifyToken, isAdmin, proofCtrl.getAllProofs);

// PUT: Approuver une preuve (Admin)
router.put("/admin/:proofId/approve", verifyToken, isAdmin, proofCtrl.approveProof);

// PUT: Rejeter une preuve (Admin)
router.put("/admin/:proofId/reject", verifyToken, isAdmin, proofCtrl.rejectProof);

module.exports = router;