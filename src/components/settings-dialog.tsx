"use client";

import { useEffect, useState } from "react";
import { GROQ_MODELS } from "@/lib/agent/model-ids";
import { clearSettings, OPEN_SETTINGS_EVENT, saveSettings, useGroqSettings } from "@/lib/settings";

/** Mounted once per page that uses AI; opens on `openSettings()`. */
export function SettingsDialog() {
  const settings = useGroqSettings();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(settings.model);

  useEffect(() => {
    const onOpen = () => {
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, [settings]);

  if (!open) return null;
  const custom = !GROQ_MODELS.some((m) => m.id === model);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal aria-labelledby="settings-title" onClick={() => setOpen(false)}>
      <form
        className="rainbow-border w-full max-w-md rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings({ apiKey: apiKey.trim(), model: model.trim() });
          setOpen(false);
        }}
      >
        <h2 id="settings-title" className="text-xl font-extrabold">
          🔑 Groq API key <span className="text-sm font-normal text-ink-soft">(BYOK)</span>
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          உங்கள் Groq key இந்த உலாவியில் மட்டுமே சேமிக்கப்படும். Your key is stored only in this browser and sent with each AI request; the server
          forwards it to Groq and never saves it. Get one free at{" "}
          <a className="underline" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
            console.groq.com/keys
          </a>
          .
        </p>

        <label className="mt-5 block text-sm font-semibold" htmlFor="groq-key">
          API key
        </label>
        <input
          id="groq-key"
          type="password"
          autoComplete="off"
          placeholder="gsk_…"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-saffron"
        />

        <label className="mt-4 block text-sm font-semibold" htmlFor="groq-model">
          Model
        </label>
        <select
          id="groq-model"
          value={custom ? "__custom" : model}
          onChange={(e) => setModel(e.target.value === "__custom" ? "" : e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm"
        >
          {GROQ_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
          <option value="__custom">Other Groq model…</option>
        </select>
        {custom && (
          <input
            placeholder="model id, e.g. qwen/qwen3-32b"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2 font-mono text-sm"
          />
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            className="text-sm text-crimson underline"
            onClick={() => {
              clearSettings();
              setApiKey("");
            }}
          >
            Remove key
          </button>
          <div className="flex gap-2">
            <button type="button" className="rounded-full border border-line px-4 py-2 text-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-gradient-to-r from-saffron to-crimson px-5 py-2 text-sm font-bold text-white">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
