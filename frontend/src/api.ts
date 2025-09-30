// src/api.ts
import config from "./config";

export async function get<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = `${config.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) }});
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} → ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function post<T = unknown, B = unknown>(path: string, body: B, init?: RequestInit): Promise<T> {
  const url = `${config.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${url} → ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}
