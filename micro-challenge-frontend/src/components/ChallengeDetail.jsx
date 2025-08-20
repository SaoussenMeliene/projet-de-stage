// src/pages/ChallengeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Trophy, Heart, CheckCircle2, ArrowLeft } from "lucide-react";
import { api } from "../lib/axios";

const unwrap = (r) => (r && typeof r === "object" && "data" in r ? r.data : r);

function statusFromDates(start, end) {
  const now = Date.now();
  if (start && now < new Date(start).getTime()) return "upcoming";
  if (end && now > new Date(end).getTime()) return "completed";
  return "active";
}

function niceDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  // fetch détail
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = unwrap(await api.get(`/challenges/${id}`));
        setItem(data?.item || data); // selon ton backend
      } catch (e) {
        console.error(e);
        setError("Impossible de charger ce défi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const startAt = item?.startAt || item?.startDate;
  const endAt   = item?.endAt   || item?.endDate;

  const status = useMemo(() => statusFromDates(startAt, endAt), [startAt, endAt]);
  const isActive = status === "active";
  const isUpcoming = status === "upcoming";
  const isCompleted = status === "completed";

  const participantsCount = item?.participants?.length || item?.participantsCount || 0;
  const likesCount = item?.likesCount || 0;
  const points = item?.points || item?.rewardPoints || 0;

  async function onJoin() {
    try {
      setJoining(true);
      await api.post(`/challenges/${id}/join`);
      const refreshed = unwrap(await api.get(`/challenges/${id}`));
      setItem(refreshed?.item || refreshed);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la participation.");
    } finally {
      setJoining(false);
    }
  }

  async function onLeave() {
    try {
      setJoining(true);
      await api.post(`/challenges/${id}/leave`);
      const refreshed = unwrap(await api.get(`/challenges/${id}`));
      setItem(refreshed?.item || refreshed);
    } catch (e) {
      console.error(e);
      alert("Erreur lors du retrait.");
    } finally {
      setJoining(false);
    }
  }

  // à adapter selon la forme réelle (booléen joined ?)
  const joined = !!item?.joined;

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="animate-pulse h-5 w-80 bg-gray-200 rounded mb-2" />
        <div className="animate-pulse h-40 w-full bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="text-red-600">{error || "Défi introuvable."}</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide bg-white/15 px-3 py-1 rounded-full">
                <span className="opacity-90 capitalize">{item.category || "Défi"}</span>
                <span className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-300" : isUpcoming ? "bg-yellow-300" : "bg-red-300"
                }`} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mt-3">{item.title}</h1>
              <p className="text-white/90 mt-2 max-w-3xl">{item.description}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="text-sm">{participantsCount} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} />
                <span className="text-sm">{likesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={18} />
                <span className="text-sm">{points} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta + CTA */}
        <div className="p-6 lg:p-8 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2">
                <Calendar size={16} />
                <span>Du {niceDate(startAt)} au {niceDate(endAt)}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Clock size={16} />
                <span>
                  {isActive ? "Défi en cours" : isUpcoming ? "Défi à venir" : "Défi terminé"}
                </span>
              </div>
            </div>

            {!isCompleted && (
              <div className="flex items-center gap-3">
                {!joined ? (
                  <button
                    onClick={onJoin}
                    disabled={joining || isUpcoming}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50"
                  >
                    {isUpcoming ? "Bientôt disponible" : joining ? "Participation..." : "Participer"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/challenges/${id}/submit`)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold inline-flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Soumettre / Marquer comme fait
                    </button>
                    <button
                      onClick={onLeave}
                      disabled={joining}
                      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      Quitter
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sections */}
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="p-5 rounded-2xl border">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {item.longDescription || item.description || "—"}
                </p>
              </section>

              <section className="p-5 rounded-2xl border">
                <h2 className="font-semibold mb-2">Règles & conditions</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {(item.rules && item.rules.length ? item.rules : ["Respectez les consignes", "Soumettez une preuve si nécessaire"]).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>

              <section className="p-5 rounded-2xl border">
                <h2 className="font-semibold mb-3">Tâches</h2>
                <ul className="space-y-2">
                  {(item.tasks && item.tasks.length ? item.tasks : ["Étape 1", "Étape 2"]).map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-gray-700">{typeof t === "string" ? t : t.label}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="p-5 rounded-2xl border">
                <h3 className="font-semibold mb-3">Participants</h3>
                <div className="flex -space-x-2">
                  {(item.participantsAvatars || []).slice(0, 8).map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                  {participantsCount > 8 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                      +{participantsCount - 8}
                    </div>
                  )}
                </div>
              </section>

              <section className="p-5 rounded-2xl border">
                <h3 className="font-semibold mb-3">Ressources</h3>
                <ul className="text-sm text-indigo-600 space-y-2">
                  {(item.resources || []).map((r, i) => (
                    <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.label || r.url}</a></li>
                  ))}
                  {(!item.resources || item.resources.length === 0) && <li className="text-gray-500">Aucune ressource.</li>}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
