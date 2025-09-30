// src/config.ts

// Evita referenciar `process` directamente (TS podría no tener los tipos cargados)
const VITE = (import.meta as any)?.env;
const NODE = (globalThis as any)?.process?.env;

export const API_BASE =
  // Frontend (Vite)
  VITE?.VITE_API_URL ||
  // Node/Jest/CI
  NODE?.VITE_API_URL ||
  // Fallback local
  "http://localhost:4000";

const config = {
  apiUrl: API_BASE,
  appName: "Technical Test",
};

export default config;
