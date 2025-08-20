import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api",
  withCredentials: false,
});

// ✅ renvoie directement res.data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// ✅ ajoute le token automatiquement aux requêtes suivantes
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
