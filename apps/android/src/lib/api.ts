import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Portfolio } from "./types";

/**
 * Website the app reads from. Set EXPO_PUBLIC_API_URL in apps/android/.env
 * (Android emulator reaches the host's localhost at http://10.0.2.2:<port>).
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://shantanusuthar.vercel.app").replace(/\/+$/, "");

const CACHE_KEY = "portfolio:v1";

/** Last good response from disk, so the app opens instantly and works offline. */
export async function readCached(): Promise<Portfolio | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Portfolio) : null;
  } catch {
    return null;
  }
}

export async function fetchPortfolio(): Promise<Portfolio> {
  const res = await fetch(`${API_URL}/api/portfolio`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Portfolio API ${res.status}`);
  const data = (await res.json()) as Portfolio;
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
  return data;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  formStartTime: number;
}

/** Same endpoint as the website's contact form (rate limits, spam checks and the sender receipt apply). */
export async function sendContact(payload: ContactPayload): Promise<string> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
  if (!res.ok) throw new Error(body.message ?? body.error ?? `Request failed (${res.status})`);
  return body.message ?? "Message sent";
}

/** Site-relative paths (e.g. /brands/react.svg) to absolute URLs. */
export const absolute = (path: string) => (path.startsWith("http") ? path : `${API_URL}${path}`);
