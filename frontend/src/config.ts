// src/config.ts

// Lee import.meta.env en Vite SIN exponer el token `import.meta` al parser de Jest
const VITE = (() => {
  try {
    // Usamos eval indirecto para que Jest no parsee `import.meta`
    // eslint-disable-next-line no-eval
    const im: any = (0, eval)('import.meta');
    return im?.env;
  } catch {
    return undefined;
  }
})();

// Node/Jest/CI
const NODE = (globalThis as any)?.process?.env as
  | Record<string, string>
  | undefined;

export const API_BASE =
  // Frontend (Vite)
  VITE?.VITE_API_URL ||
  // Node/Jest/CI
  NODE?.VITE_API_URL ||
  // Fallback local
  'http://localhost:4000';

const config = {
  apiUrl: API_BASE,
  appName: 'Technical Test',
};

export default config;

