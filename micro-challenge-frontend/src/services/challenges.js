
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
  api.get("/challenges", { params: normalizeParams(opts) }).then((r) => r.data);

export const stats = () =>
  api.get("/challenges/stats").then((r) => r.data);

export const create = (payload) =>
  api.post("/challenges", payload).then((r) => r.data);
export const getById = (id) =>
  api.get(`/challenges/${id}`).then((r) => r.data);
export default { list, stats, create ,getById };
