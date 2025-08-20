import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  ChevronRight,
  Trophy,
} from "lucide-react";

// Styles par catégorie (couleurs du chip + gradient d’en-tête)
const CATEGORY = {
  ecologique: { label: "Écologique", chip: "bg-emerald-50 text-emerald-700", grad: "from-emerald-500 to-teal-500" },
  solidaire:  { label: "Solidaire",  chip: "bg-rose-50 text-rose-700",       grad: "from-rose-500 to-pink-500" },
  creatif:    { label: "Créatif",    chip: "bg-violet-50 text-violet-700",   grad: "from-violet-500 to-fuchsia-500" },
  sportif:    { label: "Sportif",    chip: "bg-blue-50 text-blue-700",       grad: "from-blue-500 to-indigo-500" },
  educatif:   { label: "Éducatif",   chip: "bg-amber-50 text-amber-700",     grad: "from-amber-500 to-orange-500" },
  default:    { label: "Autre",      chip: "bg-gray-100 text-gray-700",      grad: "from-slate-500 to-gray-500" },
};

function normCat(raw = "") {
  const s = raw.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return CATEGORY[s] ? s : "default";
}

function getStatus(start, end) {
  const now = new Date();
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (s && now < s) return { key: "upcoming",  label: "À venir",  cls: "bg-yellow-50 text-yellow-700" };
  if (e && now > e) return { key: "completed", label: "Terminé",  cls: "bg-gray-100 text-gray-600" };
  return { key: "active", label: "En cours", cls: "bg-green-50 text-green-700" };
}

export default function ChallengeCard({ data, view = "grid", onClick, userProofs = [] }) {
  const start = data.startAt || data.startDate;
  const end   = data.endAt   || data.endDate;
  const catKey = normCat(data.category);
  const cat    = CATEGORY[catKey] || CATEGORY.default;
  const status = getStatus(start, end);

  const participants =
    (typeof data.participantsCount === 'number')
      ? data.participantsCount
      : (Array.isArray(data.participants) ? data.participants.length : (typeof data.participants === 'number' ? data.participants : 0));
  const progress =
    typeof data.progressAvg === "number"
      ? Math.max(0, Math.min(100, Math.round(data.progressAvg)))
      : (typeof data.stats?.completionRate === 'number' ? Math.max(0, Math.min(100, Math.round(data.stats.completionRate))) : null);
  const pts = data.points ?? data.rewardPoints;

  // Vérifier si l'utilisateur a soumis une preuve pour ce défi
  const challengeProofs = userProofs.filter(proof => proof.challenge?._id === data._id);
  const hasSubmittedProof = challengeProofs.length > 0;
  const proofStatus = hasSubmittedProof ? (() => {
    // Prendre le statut de la preuve la plus récente pour ce défi
    const latestProof = challengeProofs.sort((a, b) => 
      new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt)
    )[0];
    
    if (latestProof.status === 'approuve') {
      return { label: 'Preuve approuvée', cls: 'bg-green-50 text-green-700', icon: '✅' };
    }
    if (latestProof.status === 'rejete') {
      return { label: 'Preuve rejetée', cls: 'bg-red-50 text-red-700', icon: '❌' };
    }
    // Par défaut, en attente (status = 'en_attente')
    return { label: 'Preuve en attente', cls: 'bg-yellow-50 text-yellow-700', icon: '⏳' };
  })() : null;

  const Wrapper = ({ children }) => (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition p-4 ${
        view === "list" ? "flex items-center justify-between" : ""
      }`}
    >
      {children}
    </div>
  );

  return (
    <Wrapper>
      {/* LEFT */}
      <div className={view === "list" ? "flex items-center gap-4" : undefined}>
        {/* En-tête visuelle (gradient ou cover image) */}
        {view === "grid" && (
          <div className={`h-20 w-full rounded-xl mb-3 relative overflow-hidden ${
            (data.coverImage || data.image) ? '' : `bg-gradient-to-r ${cat.grad}`
          }`}>
            {(data.coverImage || data.image) ? (
              <img 
                src={data.coverImage || data.image} 
                alt={data.title} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // En cas d'erreur, afficher le gradient par défaut
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add(`bg-gradient-to-r`, cat.grad);
                }}
              />
            ) : null}
            {/* Overlay pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-2 left-2 flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
                (data.coverImage || data.image) ? 'bg-white/90 text-gray-700' : cat.chip
              }`}>
                {CATEGORY[catKey]?.label || cat.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
                (data.coverImage || data.image) ? 'bg-white/90 text-gray-700' : status.cls
              }`}>
                {status.label}
              </span>
              {proofStatus && (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
                  (data.coverImage || data.image) ? 'bg-white/90 text-blue-700' : proofStatus.cls
                }`}>
                  {proofStatus.icon} {proofStatus.label}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Titre + description + métas */}
        <div className={view === "list" ? "min-w-0" : undefined}>
          <h3 className="font-semibold text-gray-800 leading-snug line-clamp-1">{data.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{data.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {start ? new Date(start).toLocaleDateString() : "?"} → {end ? new Date(end).toLocaleDateString() : "?"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participants} part.
            </span>
            {typeof pts === "number" && (
              <span className="inline-flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {pts} pts
              </span>
            )}
          </div>

          {progress !== null && (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">{progress}% de progression</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT (actions en vue liste) */}
      {view === "list" && (
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${cat.chip}`}>
            {CATEGORY[catKey]?.label || cat.label}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${status.cls}`}>
            {status.label}
          </span>
          {proofStatus && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${proofStatus.cls}`}>
              {proofStatus.icon} {proofStatus.label}
            </span>
          )}
          <button className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </Wrapper>
  );
}