"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_MODEL } from "@/lib/agent/model-ids";

// The Groq key lives only in this browser (localStorage) and is sent with each AI request.
const KEY = "sidhar.groq.v1";

export interface GroqSettings {
  apiKey: string;
  model: string;
}

const EMPTY: GroqSettings = { apiKey: "", model: DEFAULT_MODEL };
let cached: GroqSettings | null = null;
const listeners = new Set<() => void>();

function read(): GroqSettings {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(KEY);
    cached = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached!;
}

export function saveSettings(s: GroqSettings) {
  cached = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: keep in memory for this session */
  }
  listeners.forEach((l) => l());
}

export function clearSettings() {
  cached = EMPTY;
  try {
    localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cached = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useGroqSettings() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function aiHeaders(s: GroqSettings): HeadersInit {
  return { "Content-Type": "application/json", ...(s.apiKey ? { "x-groq-api-key": s.apiKey } : {}) };
}

// Opening the settings dialog from anywhere.
export const OPEN_SETTINGS_EVENT = "sidhar:open-settings";
export function openSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
