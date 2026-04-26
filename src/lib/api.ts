// lib/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL: API_URL });

// Inyectar token en cada request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("havi_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirigir a login si el token expiró
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("havi_token");
      localStorage.removeItem("havi_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authLogin = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

export const authLogout = () =>
  api.post("/auth/logout").then((r) => r.data);

export const authMe = () =>
  api.get("/auth/me").then((r) => r.data);

// ── Perfil & Chat ─────────────────────────────────────────────────────────────
export const getPerfil = (userId: string) =>
  api.get(`/perfil/${userId}`).then((r) => r.data);

export const postChat = (userId: string, mensaje: string, historial: {role: string; content: string}[]) =>
  api.post("/chat", { user_id: userId, mensaje, historial }).then((r) => r.data);

export const postTrigger = (userId: string, trigger: string) =>
  api.post("/trigger", { user_id: userId, trigger }).then((r) => r.data);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = () =>
  api.get("/insights/dashboard").then((r) => r.data);

export const getSampleUsuarios = () =>
  api.get("/usuarios/sample").then((r) => r.data);

// ── Gemini ────────────────────────────────────────────────────────────────────
export const clasificarIntencion = (mensaje: string) =>
  api.post("/gemini/intencion", { mensaje }).then((r) => r.data);
