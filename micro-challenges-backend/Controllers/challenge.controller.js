// Controllers/challenge.controller.js (CommonJS)
const Challenge = require("../Models/Challenge");

// "Écologique" -> "ecologique"
function toSlug(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCategory(raw) {
  if (!raw) return null;
  const r = raw.trim();
  if (!r || r === "Toutes les catégories") return null;
  const lbl = toSlug(r);
  const map = {
    solidaire: "solidaire",
    ecologique: "ecologique",
    creatif: "creatif",
    sportif: "sportif",
    educatif: "educatif",
  };
  return map[lbl] || lbl;
}

function statusFilter(status) {
  const now = new Date();
  switch ((status || "all").trim()) {
    case "active":
      return {
        $or: [
          { $and: [{ startAt: { $lte: now } }, { endAt: { $gte: now } }] },
          { $and: [{ startDate: { $lte: now } }, { endDate: { $gte: now } }] },
        ],
      };
    case "upcoming":
      return { $or: [{ startAt: { $gt: now } }, { startDate: { $gt: now } }] };
    case "completed":
      return { $or: [{ endAt: { $lt: now } }, { endDate: { $lt: now } }] };
    default:
      return {};
  }
}

function sortFromKey(sortKey) {
  switch ((sortKey || "recent").trim()) {
    case "popular":
      return { participantsCount: -1, likesCount: -1, createdAt: -1 };
    case "deadline":
      return { endAt: 1, endDate: 1 };
    case "progress":
      return { progressAvg: -1, createdAt: -1 };
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
    const page  = Math.max(parseInt(req.query.page || 1, 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || 12, 10), 1), 100);
    const skip  = (page - 1) * limit;

    const q      = (req.query.q || "").trim();
    const status = (req.query.status || "all").trim();
    const sort   = sortFromKey(req.query.sort);
    const and    = [];

    // Catégorie (gère label FR avec accents ET slug)
    const normalized = normalizeCategory(req.query.category);
    if (normalized) {
      const rxLabel = new RegExp(`^${escapeRegExp(req.query.category)}$`, "iu");
      and.push({ $or: [{ category: normalized }, { category: rxLabel }] });
    }

    // Statut (gère startAt/endAt et startDate/endDate)
    const sf = statusFilter(status);
    if (Object.keys(sf).length) and.push(sf);

    // Recherche (au moins 2 caractères)
    if (q.length >= 2) {
      const rx = new RegExp(escapeRegExp(q), "iu");
      and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] });
    }

    const filter = and.length ? { $and: and } : {};

    const [total, items] = await Promise.all([
      Challenge.countDocuments(filter),
      Challenge.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ]);

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
      Challenge.countDocuments({
        $or: [
          { $and: [{ startAt: { $lte: now } }, { endAt: { $gte: now } }] },
          { $and: [{ startDate: { $lte: now } }, { endDate: { $gte: now } }] },
        ],
      }),
      Challenge.countDocuments({ $or: [{ startAt: { $gt: now } }, { startDate: { $gt: now } }] }),
      Challenge.countDocuments({ $or: [{ endAt: { $lt: now } }, { endDate: { $lt: now } }] }),
    ]);

    res.json({ all, active, upcoming, completed });
  } catch (err) {
    console.error("getChallengeStats error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

// (optionnel) création rapide pour tests
async function createChallenge(req, res) {
  try {
    const body = req.body || {};

    const cat = normalizeCategory(body.category || "");
    if (!cat) return res.status(400).json({ msg: "Catégorie invalide." });

    const start = body.startAt || body.startDate;
    const end   = body.endAt   || body.endDate;
    const startAt = start ? new Date(start) : null;
    const endAt   = end   ? new Date(end)   : null;
    if (!startAt || !endAt) return res.status(400).json({ msg: "Dates requises (startAt/startDate, endAt/endDate)." });

    const doc = await Challenge.create({
      title: String(body.title || "").trim(),
      description: String(body.description || ""),
      category: cat,
      tags: Array.isArray(body.tags) ? body.tags : [],
      startAt,
      endAt,
      participantsCount: Number(body.participantsCount || 0),
      likesCount: Number(body.likesCount || 0),
      progressAvg: Number(body.progressAvg || 0),
      coverImage: body.coverImage || null,
      createdBy: req.user?.userId || null,
      // garde aussi startDate/endDate pour compat avec anciens docs
      startDate: startAt,
      endDate: endAt,
    });

    res.status(201).json({ item: doc });
  } catch (err) {
    console.error("createChallenge error:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
}

module.exports = {
  listChallenges,
  getChallengeStats,
  createChallenge,
};
