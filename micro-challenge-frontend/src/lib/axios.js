import axios from "axios";

export const api  = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: false,
});
api.interceptors.response.use(
  (response) => response.data,   // <= on renvoie directement les données utiles
  (error) => Promise.reject(error)
);