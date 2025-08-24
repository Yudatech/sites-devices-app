import axios, { type AxiosInstance } from "axios";

/**
 * API base URL is configurable via Vite env.
 * Falls back to the json-server default so the local dev still works.
 */
export const API_BASE_URL: string =
  (import.meta as any)?.env?.VITE_API_BASE_URL ?? "http://localhost:4000";

/**
 * Shared Axios instance for the app.
 * Keeping a single client makes it easy to:
 *  - add interceptors,
 *  - set auth headers,
 *  - mock in tests.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Handy helper if you want to point the client to a different base dynamically
 * (useful in tests or previews).
 */
export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
}
