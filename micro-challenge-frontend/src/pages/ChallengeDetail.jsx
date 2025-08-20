// src/pages/ChallengeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, Users, Trophy, Heart, MessageSquare, Share2,
} from "lucide-react";
import { api } from "../lib/axios";

function fmt(d) { return d ? new Date(d).toLocaleDateString() : "—"; }
function daysBetween(a, b) {
  if (!a || !b) return "—";
  const A = new Date(a), B = new Date(b);
  return Math.max(1, Math.ceil((B - A) / 86400000));
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // overview|goals|participants|rewards
  const [joining, setJoining] = useState(false);

  const startAt = item?.startAt || item?.startDate;
  const endAt   = item?.endAt   || item?.endDate;
  const duration = useMemo(() => daysBetween(startAt, endAt), [startAt, endAt]);
  const participantsCount = item?.participantsCount ?? (item?.participants?.length || 0);
  const points = item?.rewardPoints || 0;
  const progress = Math.min(100, Math.max(0, item?.progressAvg || 0));
  const capacity = item?.capacity || 0; // 0 = illimité
  const joined = !!item?.joined;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.get(`/challenges/${id}`); // ton axios renvoie déjà data
        setItem(data.item || data);
      } catch (e) {
        console.error(e);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  async function refresh() {
    const data = await api.get(`/challenges/${id}`);
    setItem(data.item || data);
  }
  async function onJoin() {
    try {
      setJoining(true);
      await api.post(`/challenges/${id}/join`);
      await refresh();
    } catch (e) {
      console.error(e);
      alert("Impossible de participer.");
    } finally {
      setJoining(false);
    }
  }
  async function onLeave() {
    try {
      setJoining(true);
      await api.post(`/challenges/${id}/leave`);
      await refresh();
    } catch (e) {
      console.error(e);
      alert("Impossible de quitter.");
    } finally {
      setJoining(false);
    }
  }

  if (loading || !item) {
    return <div className="p-8 text-gray-500">Chargement…</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* HERO */}
      <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="relative h-56 md:h-72">
          {/* Image de couverture */}
          <img
            src={item.coverImage || "/banners/placeholder.jpg"}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/90">
                {item.category || "Défi"}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-white/15 hover:bg-white/25"><Share2 size={16} /></button>
                <button className="p-2 rounded-full bg-white/15 hover:bg-white/25"><Heart size={16} /></button>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{item.title}</h1>
            {/* ligne d’infos */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90 mt-2">
              <div className="inline-flex items-center gap-2"><Calendar size={16}/>{fmt(startAt)} – {fmt(endAt)}</div>
              <div className="inline-flex items-center gap-2"><Clock size={16}/>{duration} jours</div>
              <div className="inline-flex items-center gap-2"><Users size={16}/>{participantsCount}{capacity ? `/${capacity}` : ""} participants</div>
              <div className="inline-flex items-center gap-2"><Trophy size={16}/>{points} points</div>
            </div>
          </div>
        </div>

        {/* Progress + actions */}
        <div className="p-4 md:p-5 bg-white">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {!joined ? (
              <button
                onClick={onJoin}
                disabled={joining}
                className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
              >
                Participer au défi
              </button>
            ) : (
              <div className="flex gap-3 w-full">
                <button className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Continuer
                </button>
                <button onClick={onLeave} disabled={joining} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">
                  Quitter
                </button>
              </div>
            )}
            <button className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2">
              <MessageSquare size={16}/> Discussion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 bg-white rounded-xl border p-1 inline-flex">
        {[
          {id:"overview",label:"Aperçu"},
          {id:"goals",label:"Objectifs"},
          {id:"participants",label:"Participants"},
          {id:"rewards",label:"Récompenses"},
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t.id?"bg-emerald-50 text-emerald-700":"text-gray-600 hover:bg-gray-50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="mt-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Aperçu */}
          {tab === "overview" && (
            <>
              <section className="p-5 rounded-2xl border bg-white">
                <h2 className="font-semibold mb-2">Description du défi</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {item.longDescription || item.description || "—"}
                </p>
              </section>

              {/* KPI cards (facultatif) */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border bg-white">
                  <div className="text-2xl font-bold">{item.successRate ?? 78}%</div>
                  <div className="text-gray-500 text-sm">Taux de réussite</div>
                </div>
                <div className="p-5 rounded-2xl border bg-white">
                  <div className="text-2xl font-bold">{item.avgScore ?? 85}</div>
                  <div className="text-gray-500 text-sm">Score moyen</div>
                </div>
                <div className="p-5 rounded-2xl border bg-white">
                  <div className="text-2xl font-bold">{item.impactTons ?? 2.3} t</div>
                  <div className="text-gray-500 text-sm">Impact total</div>
                </div>
              </div>

              {/* Organisateur */}
              <section className="p-5 rounded-2xl border bg-white">
                <h3 className="font-semibold mb-3">Organisateur</h3>
                <div className="flex items-center gap-3">
                  <img
                    src={item.createdBy?.profileImage || "/avatars/default.png"}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">
                      {item.createdBy?.firstName || ""} {item.createdBy?.lastName || ""}
                    </div>
                    <div className="text-xs text-gray-500">Coordinateur</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Objectifs */}
          {tab === "goals" && (
            <section className="p-5 rounded-2xl border bg-white">
              <h2 className="font-semibold mb-2">Objectifs</h2>
              <ul className="space-y-2">
                {(item.tasks && item.tasks.length ? item.tasks : ["Étape 1", "Étape 2"]).map((t, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span>{typeof t === "string" ? t : t.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Participants */}
          {tab === "participants" && (
            <section className="p-5 rounded-2xl border bg-white">
              <h2 className="font-semibold mb-3">Participants ({participantsCount})</h2>
              <div className="flex flex-wrap gap-3">
                {(item.participants || []).map((u) => (
                  <div key={u._id} className="flex items-center gap-2">
                    <img className="w-8 h-8 rounded-full object-cover" src={u.profileImage || "/avatars/default.png"} />
                    <span className="text-sm">{u.username || `${u.firstName || ""} ${u.lastName || ""}`}</span>
                  </div>
                ))}
                {participantsCount === 0 && <div className="text-gray-500 text-sm">Aucun participant pour l’instant.</div>}
              </div>
            </section>
          )}

          {/* Récompenses */}
          {tab === "rewards" && (
            <section className="p-5 rounded-2xl border bg-white">
              <h2 className="font-semibold mb-2">Récompenses</h2>
              <p className="text-gray-600">Ce défi vaut <b>{points}</b> points. Débloquez des badges et des avantages.</p>
            </section>
          )}
        </div>

        {/* Sidebar info */}
        <aside className="space-y-6">
          <section className="p-5 rounded-2xl border bg-white">
            <h3 className="font-semibold mb-3">Informations</h3>
            <div className="text-sm flex flex-col gap-2">
              <div className="flex items-center justify-between"><span className="text-gray-500">Difficulté</span><span className="font-medium capitalize">{item.difficulty || "intermédiaire"}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">Durée</span><span className="font-medium">{duration} jours</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">Participants</span><span className="font-medium">{participantsCount}{capacity ? `/${capacity}` : ""}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">Points</span><span className="font-medium">{points}</span></div>
            </div>
          </section>
          <section className="p-5 rounded-2xl border bg-white">
            <h3 className="font-semibold mb-3">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm">Signaler</button>
              <button className="w-full px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center gap-2">
                <Heart size={16}/> J’aime
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

