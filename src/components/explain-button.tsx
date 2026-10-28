"use client";

import { useState, useSyncExternalStore } from "react";
import { aiHeaders, openSettings, useGroqSettings } from "@/lib/settings";

interface AiMeaning {
  ta: string;
  en: string;
  note?: string;
  words?: { word: string; meaning: string }[];
  reviewed?: boolean;
}

const cacheKey = (workId: string, n: number) => `sidhar.meaning.${workId}.${n}`;
const noopSubscribe = () => () => {};
function readCache(workId: string, n: number) {
  try {
    return localStorage.getItem(cacheKey(workId, n));
  } catch {
    return null;
  }
}

export function ExplainButton({ workId, n }: { workId: string; n: number }) {
  const settings = useGroqSettings();
  const [fresh, setMeaning] = useState<AiMeaning | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const cachedRaw = useSyncExternalStore(noopSubscribe, () => readCache(workId, n), () => null);
  const meaning = fresh ?? (cachedRaw ? (JSON.parse(cachedRaw) as AiMeaning) : null);

  async function explain() {
    if (!settings.apiKey) return openSettings();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: aiHeaders(settings),
        body: JSON.stringify({ workId, n, model: settings.model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      setMeaning(data.meaning);
      try {
        localStorage.setItem(cacheKey(workId, n), JSON.stringify(data.meaning));
      } catch {}
      setState("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }

  if (meaning) return <MeaningBlock meaning={meaning} source="ai" onRegenerate={explain} busy={state === "loading"} />;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        onClick={explain}
        disabled={state === "loading"}
        className="rounded-full bg-gradient-to-r from-indigo to-peacock px-4 py-1.5 text-sm font-bold text-white shadow transition hover:opacity-90 disabled:opacity-60"
      >
        {state === "loading" ? "✨ பொருள் எழுதப்படுகிறது… (draft → review)" : settings.apiKey ? "✨ AI பொருள் · Explain" : "🔑 Add Groq key to explain"}
      </button>
      {state === "error" && <span className="text-sm text-crimson">{error}</span>}
    </div>
  );
}

export function MeaningBlock({
  meaning,
  source,
  onRegenerate,
  busy,
}: {
  meaning: AiMeaning;
  source: "curated" | "ai";
  onRegenerate?: () => void;
  busy?: boolean;
}) {
  return (
    <div className={`mt-4 rounded-xl border-l-4 p-4 ${source === "curated" ? "border-leaf bg-leaf/5" : "border-indigo bg-indigo/5"}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide">
        {source === "curated" ? (
          <span className="text-leaf">✔ பொழிப்புரை · Curated meaning</span>
        ) : (
          <span className="text-indigo">✨ AI பொழிப்புரை · AI draft{meaning.reviewed === false ? " (unreviewed)" : ""} — verify with a commentary</span>
        )}
        {onRegenerate && (
          <button onClick={onRegenerate} disabled={busy} className="ml-auto rounded-full border border-line px-2 py-0.5 font-semibold normal-case text-ink-soft hover:text-ink">
            {busy ? "…" : "↻ regenerate"}
          </button>
        )}
      </div>
      <p className="leading-relaxed">{meaning.ta}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{meaning.en}</p>
      {meaning.note && <p className="mt-2 text-sm italic text-ink-soft">💡 {meaning.note}</p>}
      {!!meaning.words?.length && (
        <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
          {meaning.words.map((w) => (
            <div key={w.word} className="flex gap-2">
              <dt className="font-semibold text-crimson">{w.word}</dt>
              <dd className="text-ink-soft">— {w.meaning}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
