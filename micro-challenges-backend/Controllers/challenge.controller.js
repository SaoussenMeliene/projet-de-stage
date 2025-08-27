// Controllers/challenge.controller.js (CommonJS)
const mongoose = require("mongoose");
const Challenge = require("../Models/Challenge");
const Notification = require("../Models/Notification");
const User = require("../Models/User");
const Participant = require("../Models/Participant");
const Group = require("../Models/Group");

// Mappe les labels du front vers l'enum du modèle (Models/Challenge.js)
function normalizeCategory(cat) {
  if (!cat || cat === "Toutes les catégories") return null;
  const m = {
    "Écologique": "écologique",  // Garde les accents pour correspondre aux données existantes
    "Ecologique": "écologique", 
    "Solidaire": "solidaire",
    "Créatif": "créatif",
    "Sportif": "sportif", 
    "Éducatif": "éducatif",
   
  };
  return m[cat] || cat;
}

function statusFilter(status) {
  const now = new Date();
  switch ((status || "all").trim()) {
    case "active":
      return { startDate: { $lte: now }, endDate: { $gte: now } };
    case "upcoming":
      return { startDate: { $gt: now } };
    case "completed":
      return { endDate: { $lt: now } };
    default:
      return {};
  }
}

function sortFromKey(sortKey) {
  switch ((sortKey || "recent").trim()) {
    case "popular":
      return { participantsCount: -1, createdAt: -1 };
    case "deadline":
      return { endDate: 1 };
    case "progress":
      // pas de champ "progress" dans le modèle : on retombe sur createdAt
      return { createdAt: -1 };
    case "recent":
    default:
      return { createdAt: -1 };
  }
}

function escapeRegExp(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listChallenges(req, res) {
  try {
    console.log("=== listChallenges ===");
    console.log("Query params:", req.query);
    
    const page  = Math.max(parseInt(req.query.page || 1, 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || 12, 10), 1), 100);
    const skip  = (page - 1) * limit;

    const q        = (req.query.q || "").trim();
    const category = normalizeCategory(req.query.category || "");
    const sort     = sortFromKey(req.query.sort);
    const sf       = statusFilter(req.query.status);
    
    console.log("Processed params:", { q, category, sort, sf });

    const and = [];
    if (category) and.push({ category });
    if (Object.keys(sf).length) and.push(sf);

    if (q.length >= 2) {
      const rx = new RegExp(escapeRegExp(q), "i");
      and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] });
    }

    const filter = and.length ? { $and: and } : {};
    console.log("Final filter:", JSON.stringify(filter, null, 2));

    const [total, itemsRaw] = await Promise.all([
      Challenge.countDocuments(filter),
      Challenge.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ]);
    
    console.log("Results:", { total, itemsCount: itemsRaw.length });

    // Calculer les stats dynamiques pour les items retournés
    let items = itemsRaw;
    try {
      const ids = itemsRaw.map((it) => it._id).filter(Boolean);
      if (ids.length) {
        const statsAgg = await Participant.aggregate([
          { $match: { challenge: { $in: ids } } },
          {
            $group: {
              _id: "$challenge",
              total: { $sum: 1 },
              confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmé"] }, 1, 0] } },
              avgScore: { $avg: "$score" },
            },
          },
        ]);
        const byId = new Map(statsAgg.map((s) => [String(s._id), s]));
        items = itemsRaw.map((it) => {
          const s = byId.get(String(it._id));
          const participantsCount = s?.total ?? it.participantsCount ?? 0;
          const completionRate = participantsCount > 0 ? Math.round(((s?.confirmed || 0) / participantsCount) * 100) : 0;
          const averageScore = Math.round(s?.avgScore || 0);
          return {
            ...it,
            participantsCount,
            progressAvg: completionRate,
            stats: { completionRate, averageScore },
          };
        });
      }
    } catch (aggErr) {
      console.warn("Aggregation for listChallenges failed:", aggErr.message);
    }

    res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("listChallenges error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

async function getChallengeStats(_req, res) {
  try {
    const now = new Date();
    
    // Statistiques des défis par statut temporal
    const [all, active, upcoming, completedByDate] = await Promise.all([
      Challenge.estimatedDocumentCount(),
      Challenge.countDocuments({ startDate: { $lte: now }, endDate: { $gte: now } }),
      Challenge.countDocuments({ startDate: { $gt: now } }),
      Challenge.countDocuments({ endDate: { $lt: now } }),
    ]);

    // Statistiques de participation réelles depuis la collection Participant
    let totalUsers = 0;
    let completedParticipations = 0;
    let totalBadgesCount = 0;
    
    try {
      // Compter les utilisateurs uniques qui ont participé
      const uniqueUsers = await Participant.aggregate([
        { $group: { _id: "$user" } },
        { $count: "count" }
      ]);
      totalUsers = uniqueUsers[0]?.count || 0;

      // Compter les participations confirmées (défis réalisés)
      completedParticipations = await Participant.countDocuments({ status: "confirmé" });

      // Estimation des badges: environ 0.7 badge par participation confirmée
      totalBadgesCount = Math.floor(completedParticipations * 0.7);
      
    } catch (participantErr) {
      console.warn("Erreur lors du calcul des stats Participant:", participantErr.message);
    }

    res.json({ 
      // Statistiques des défis (compatible avec l'existant)
      all, 
      active, 
      upcoming, 
      completed: completedByDate,
      
      // Nouvelles statistiques de participation
      stats: {
        totalUsers,
        completedParticipations, 
        totalBadgesCount,
        // Alias pour la compatibilité avec le frontend
        completed: completedParticipations,
        participants: totalUsers,
        badges: totalBadgesCount
      }
    });
  } catch (err) {
    console.error("getChallengeStats error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

async function getChallengeById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID invalide" });
    }

    // Récupérer le défi
    const doc = await Challenge.findById(id).lean();
    if (!doc) return res.status(404).json({ msg: "Défi introuvable" });

    // Statistiques dynamiques via Participant
    let participantsCount = doc.participantsCount || 0;
    let confirmedCount = 0;
    let avgScore = 0;
    try {
      const [countAll, countConfirmed, avg] = await Promise.all([
        Participant.countDocuments({ challenge: id }),
        Participant.countDocuments({ challenge: id, status: 'confirmé' }),
        Participant.aggregate([
          { $match: { challenge: new mongoose.Types.ObjectId(id) } },
          { $group: { _id: null, avgScore: { $avg: "$score" } } }
        ])
      ]);
      participantsCount = countAll;
      confirmedCount = countConfirmed;
      avgScore = Math.round(avg?.[0]?.avgScore || 0);
    } catch (e) {
      console.warn("Impossible de calculer les stats Participant:", e.message);
    }

    const completionRate = participantsCount > 0
      ? Math.round((confirmedCount / participantsCount) * 100)
      : 0;

    res.json({ item: { 
      ...doc, 
      participantsCount,
      progressAvg: completionRate,
      stats: {
        completionRate,
        averageScore: avgScore
      }
    } });
  } catch (err) {
    console.error("getChallengeById error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

async function createChallenge(req, res) {
  try {
    const body = req.body || {};
    const cat = normalizeCategory(body.category || "");
    if (!cat) return res.status(400).json({ msg: "Catégorie invalide." });
    if (!body.startDate || !body.endDate) {
      return res.status(400).json({ msg: "Dates requises (startDate, endDate)." });
    }

    const doc = await Challenge.create({
      title: String(body.title || "").trim(),
      description: String(body.description || ""),
      category: cat,
      tags: Array.isArray(body.tags) ? body.tags : [],
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      participantsCount: Number(body.participants || 0),
      participants: [], // Tableau vide d'ObjectId au début
      image: body.image || null,
      coverImage: body.image || body.coverImage || null, // Support des deux champs
      rewardPoints: Number(body.rewardPoints || 0),
      tasks: Array.isArray(body.tasks) ? body.tasks : [],
      createdBy: req.user?.userId || undefined,
    });

    // Créer des notifications pour tous les collaborateurs (non-admin)
    try {
      const collaborators = await User.find({ role: { $ne: 'admin' } });
      const notifications = collaborators.map(user => ({
        user: user._id,
        title: "Nouveau défi disponible !",
        message: `Un nouveau défi "${doc.title}" vient d'être ajouté. Découvrez-le maintenant !`
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`📢 ${notifications.length} notifications créées pour le nouveau défi: ${doc.title}`);
      }
    } catch (notifError) {
      console.error("Erreur lors de la création des notifications:", notifError);
      // On continue même si les notifications échouent
    }

    res.status(201).json({ item: doc });
  } catch (err) {
    console.error("createChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

// NB: ton modèle stocke juste un nombre "participants" (pas une liste d'utilisateurs)
// -> on incrémente/décrémente simplement le compteur.
async function joinChallenge(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID invalide" });
    }
    const doc = await Challenge.findByIdAndUpdate(
      id,
      { $inc: { participantsCount: 1 } },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ msg: "Défi introuvable" });
    res.json({ item: doc });
  } catch (err) {
    console.error("joinChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

async function leaveChallenge(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID invalide" });
    }
    const doc = await Challenge.findById(id);
    if (!doc) return res.status(404).json({ msg: "Défi introuvable" });
    doc.participantsCount = Math.max(0, (doc.participantsCount || 0) - 1);
    await doc.save();
    res.json({ item: doc.toObject() });
  } catch (err) {
    console.error("leaveChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

async function updateChallenge(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID invalide" });
    }

    const body = req.body || {};
    const updateFields = {};

    console.log("=== UpdateChallenge Admin ===");
    console.log("Body reçu:", body);

    // IMPORTANT: AUCUN champ n'est obligatoire pour la modification admin
    // L'admin peut modifier seulement les champs qu'il souhaite
    if (body.title !== undefined && body.title !== null) {
      updateFields.title = String(body.title).trim();
      console.log("Titre à modifier:", updateFields.title);
    }
    if (body.description !== undefined && body.description !== null) {
      updateFields.description = String(body.description);
      console.log("Description à modifier:", updateFields.description);
    }
    if (body.category !== undefined && body.category !== null) {
      const cat = normalizeCategory(body.category);
      if (cat) {
        updateFields.category = cat;
        console.log("Catégorie à modifier:", updateFields.category);
      }
    }
    if (body.tags !== undefined) {
      updateFields.tags = Array.isArray(body.tags) ? body.tags : [];
      console.log("Tags à modifier:", updateFields.tags);
    }
    if (body.startDate !== undefined && body.startDate !== null) {
      updateFields.startDate = new Date(body.startDate);
      console.log("Date début à modifier:", updateFields.startDate);
    }
    if (body.endDate !== undefined && body.endDate !== null) {
      updateFields.endDate = new Date(body.endDate);
      console.log("Date fin à modifier:", updateFields.endDate);
    }
    if (body.image !== undefined) {
      updateFields.image = body.image;
      updateFields.coverImage = body.image;
      console.log("Image à modifier:", updateFields.image);
    }
    if (body.coverImage !== undefined) {
      updateFields.coverImage = body.coverImage;
      if (!body.image) updateFields.image = body.coverImage;
      console.log("CoverImage à modifier:", updateFields.coverImage);
    }
    if (body.rewardPoints !== undefined) {
      updateFields.rewardPoints = Number(body.rewardPoints || 0);
      console.log("Points à modifier:", updateFields.rewardPoints);
    }
    if (body.tasks !== undefined) {
      updateFields.tasks = Array.isArray(body.tasks) ? body.tasks : [];
      console.log("Tâches à modifier:", updateFields.tasks);
    }

    console.log("Champs à mettre à jour:", updateFields);

    // Si aucun champ à mettre à jour, on retourne le défi tel qu'il est
    if (Object.keys(updateFields).length === 0) {
      console.log("Aucun champ à mettre à jour");
      const existingChallenge = await Challenge.findById(id).lean();
      if (!existingChallenge) {
        return res.status(404).json({ msg: "Défi introuvable" });
      }
      return res.json({ 
        item: existingChallenge,
        msg: "Aucune modification effectuée (aucun champ fourni)"
      });
    }

    // Vérifier que le défi existe
    const existingChallenge = await Challenge.findById(id);
    if (!existingChallenge) {
      return res.status(404).json({ msg: "Défi introuvable" });
    }

    // Mise à jour directe MongoDB sans validation Mongoose
    // Ceci ignore TOUS les validateurs, y compris les champs required
    const db = mongoose.connection.db;
    const result = await db.collection('challenges').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ msg: "Défi introuvable lors de la mise à jour" });
    }

    console.log("Modification réussie:", result);

    res.json({ 
      item: result,
      msg: "Défi mis à jour avec succès"
    });

  } catch (err) {
    console.error("updateChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur lors de la modification." });
  }
}

// Fonction pour supprimer un défi (admin seulement)
async function deleteChallenge(req, res) {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de défi invalide" });
    }

    console.log(`=== DeleteChallenge Admin ===`);
    console.log(`ID à supprimer: ${id}`);

    // Vérifier que le défi existe
    const existingChallenge = await Challenge.findById(id);
    if (!existingChallenge) {
      return res.status(404).json({ msg: "Défi introuvable" });
    }

    console.log(`Défi trouvé: "${existingChallenge.title}"`);

    // Supprimer toutes les données liées au défi
    console.log("Suppression des données liées...");
    
    // 1. Supprimer tous les participants du défi
    const participantsDeleted = await Participant.deleteMany({ challenge: id });
    console.log(`Participants supprimés: ${participantsDeleted.deletedCount}`);

    // 2. Supprimer toutes les preuves du défi
    const preuveModels = ['Proof']; // Ajouter d'autres modèles de preuve si nécessaire
    for (const modelName of preuveModels) {
      try {
        const Model = mongoose.model(modelName);
        const proofsDeleted = await Model.deleteMany({ challenge: id });
        console.log(`${modelName} supprimées: ${proofsDeleted.deletedCount}`);
      } catch (err) {
        // Modèle n'existe pas, continuer
        console.log(`Modèle ${modelName} non trouvé, ignoré`);
      }
    }

    // 3. Supprimer les groupes liés au défi (si ils existent)
    const groupsDeleted = await Group.deleteMany({ challenge: id });
    console.log(`Groupes supprimés: ${groupsDeleted.deletedCount}`);

    // 4. Enfin, supprimer le défi lui-même
    await Challenge.findByIdAndDelete(id);
    console.log("Défi supprimé avec succès");

    res.json({ 
      msg: "Défi supprimé avec succès",
      deleted: {
        challenge: existingChallenge.title,
        participants: participantsDeleted.deletedCount,
        groups: groupsDeleted.deletedCount
      }
    });

  } catch (err) {
    console.error("deleteChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur lors de la suppression du défi" });
  }
}

module.exports = {
  listChallenges,
  getChallengeStats,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
};
