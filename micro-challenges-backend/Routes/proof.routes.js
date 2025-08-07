const express = require("express");
const router = express.Router();
const proofCtrl = require("../Controllers/proof.controller");
const verifyToken = require("../Middleware/auth");
const { upload } = require("../Middleware/upload"); // attention à la casse ici !

// Soumettre une preuve (commentaire ou fichier ou les deux)
router.post(
  "/:challengeId",
  verifyToken,
  upload.single("file"),         // ← multer gère le champ "file"
  proofCtrl.submitProof
);

//  Admin ou user : voir toutes les preuves d’un challenge
router.get(
  "/challenge/:challengeId",
  verifyToken,
  proofCtrl.getProofsForChallenge
);

//  Admin : valider ou refuser une preuve
router.patch(
  "/:proofId",
  verifyToken,
  proofCtrl.validateProof
);

router.get("/rewards/:userId", verifyToken, proofCtrl.getUserRewards);




module.exports = router;
