// Controllers/challenge.controller.js (CommonJS)
const mongoose = require("mongoose");
const Challenge = require("../Models/Challenge");
const Notification = require("../Models/Notification");
const User = require("../Models/User");
const Participant = require("../Models/Participant");

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
    const [all, active, upcoming, completed] = await Promise.all([
      Challenge.estimatedDocumentCount(),
      Challenge.countDocuments({ startDate: { $lte: now }, endDate: { $gte: now } }),
      Challenge.countDocuments({ startDate: { $gt: now } }),
      Challenge.countDocuments({ endDate: { $lt: now } }),
    ]);
    res.json({ all, active, upcoming, completed });
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

module.exports = {
  listChallenges,
  getChallengeStats,
  getChallengeById,
  createChallenge,
  joinChallenge,
  leaveChallenge,
};
