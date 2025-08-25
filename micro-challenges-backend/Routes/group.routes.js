const express = require("express");
const router = express.Router();
const groupCtrl = require("../Controllers/group.controller");
const verifyToken = require("../Middleware/auth");

// GET: Récupérer tous les groupes (admin seulement)
router.get("/", verifyToken, groupCtrl.getAllGroups);

// GET: Récupérer tous les groupes de l'utilisateur
router.get("/user", verifyToken, groupCtrl.getUserGroups);

// GET: Récupérer les détails d'un groupe spécifique
router.get("/:groupId", verifyToken, groupCtrl.getGroupDetails);

// POST: Créer un nouveau groupe (admin seulement)
router.post("/", verifyToken, groupCtrl.createGroup);

// POST: Ajouter un membre au groupe (admin seulement)
router.post("/:groupId/members", verifyToken, groupCtrl.addMemberToGroup);

// DELETE: Supprimer un membre du groupe (admin seulement)
router.delete("/:groupId/members/:userId", verifyToken, groupCtrl.removeMemberFromGroup);

// POST: Quitter un groupe
router.post("/:groupId/leave", verifyToken, groupCtrl.leaveGroup);

// GET: Récupérer les statistiques d'un groupe
router.get("/:groupId/stats", verifyToken, groupCtrl.getGroupStats);

// PUT: Modifier un groupe (admin seulement)  
router.put("/:groupId", verifyToken, groupCtrl.updateGroup);

// DELETE: Supprimer un groupe (admin seulement)
router.delete("/:groupId", verifyToken, groupCtrl.deleteGroup);

module.exports = router;
