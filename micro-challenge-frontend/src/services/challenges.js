
import { api } from "../lib/axios";

const normalizeParams = ({
  page = 1,
  limit = 12,
  q = "",
  category,
  status,
  sort = "recent",
} = {}) => {
  const params = { page, limit };
  if (q && q.trim()) params.q = q.trim();
  // Le back normalise la catégorie, donc on peut lui passer le label tel quel
  if (category && category !== "Toutes les catégories") params.category = category;
  if (status && status !== "all") params.status = status;
  if (sort) params.sort = sort;
  return params;
};

export const list = (opts) =>
  api.get("/challenges", { params: normalizeParams(opts) });

export const stats = () =>
  api.get("/challenges/stats");

export const create = (payload) =>
  api.post("/challenges", payload);

export const update = (id, payload) =>
  api.put(`/challenges/${id}`, payload);

export const getById = (id) =>
  api.get(`/challenges/${id}`);

export default { list, stats, create, update, getById };
