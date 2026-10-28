"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { aiHeaders, openSettings, useGroqSettings } from "@/lib/settings";

interface Source {
  id: string;
  workId: string;
  n: number;
  label: string;
  workTitle: string;
  siddhar: string;
}
interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  error?: boolean;
}

const STARTERS = [
  "“அன்பே சிவம்” பாடலின் பொருள் என்ன?",
  "Tell me the story of Pattinathar and the eyeless needle.",
  "சிவவாக்கியர் சாதியைப் பற்றி என்ன சொல்கிறார்?",
  "What does Pambatti Siddhar mean by the dancing snake?",
  "திருமூலர் எந்தக் காலத்தவர்?",
  "Which Siddhars criticised temple rituals, and how?",
];

// Tiny markdown subset: headings, bullets, **bold**, and [S1] citations linked to sources.
function renderInline(text: string, sources?: Source[]): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[S\d+\])/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const cite = part.match(/^\[(S\d+)\]$/);
    if (cite) {
      const s = sources?.find((x) => x.id === cite[1]);
      return s ? (
        <Link key={i} href={`/songs/${s.workId}/${s.n}`} className="mx-0.5 rounded bg-saffron/20 px-1 text-xs font-bold text-crimson hover:underline" title={`${s.workTitle} ${s.label}`}>
          {cite[1]}
        </Link>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Markdown({ text, sources }: { text: string; sources?: Source[] }) {
  return (
    <div className="space-y-2 leading-relaxed">
      {text.split(/\n{2,}/).map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s/.test(l))) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5">
              {lines.map((l, i) => (
                <li key={i}>{renderInline(l.replace(/^\s*([-*•]|\d+\.)\s/, ""), sources)}</li>
              ))}
            </ul>
          );
        }
        const h = block.match(/^#{1,4}\s+(.*)/);
        if (h) return <p key={bi} className="font-bold text-crimson">{renderInline(h[1], sources)}</p>;
        return (
          <p key={bi}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {renderInline(l, sources)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function ChatPanel({ initialQuestion = "" }: { initialQuestion?: string }) {
  const settings = useGroqSettings();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(initialQuestion);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    if (!settings.apiKey) {
      openSettings();
      return;
    }
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const patch = (fn: (m: Msg) => Msg) => setMessages((ms) => [...ms.slice(0, -1), fn(ms[ms.length - 1])]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: aiHeaders(settings),
        body: JSON.stringify({ model: settings.model, messages: history.filter((m) => !m.error).map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "token") patch((m) => ({ ...m, content: m.content + ev.text }));
          else if (ev.type === "sources") patch((m) => ({ ...m, sources: ev.sources }));
          else if (ev.type === "error") throw new Error(ev.message);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        patch((m) => ({ ...m, error: true, content: (m.content ? m.content + "\n\n" : "") + "⚠️ " + (e instanceof Error ? e.message : String(e)) }));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="mt-6 flex min-h-[60vh] flex-col rounded-3xl border border-line bg-card shadow-lg">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${settings.apiKey ? "bg-leaf" : "bg-crimson"}`} />
          {settings.apiKey ? (
            <span>
              Groq · <code className="text-xs">{settings.model}</code>
            </span>
          ) : (
            <span>No API key yet</span>
          )}
        </span>
        <div className="flex gap-2">
          {!!messages.length && (
            <button onClick={() => setMessages([])} className="rounded-full border border-line px-3 py-1 font-semibold" disabled={busy}>
              New chat
            </button>
          )}
          <button onClick={openSettings} className="rounded-full bg-bg-soft px-3 py-1 font-semibold">
            🔑 {settings.apiKey ? "Settings" : "Add Groq key"}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {!messages.length && (
          <div className="py-6 text-center">
            <p className="text-5xl">🙏</p>
            <p className="mt-3 text-lg font-bold">வணக்கம்! சித்தர்களைப் பற்றி எதையும் கேளுங்கள்.</p>
            <p className="text-sm text-ink-soft">Ask anything about the Siddhars, their songs and meanings. Other topics are politely declined.</p>
            <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-xl border border-line bg-bg px-3 py-2 text-left text-sm transition hover:border-saffron hover:bg-saffron/5">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-saffron to-crimson px-4 py-2.5 text-white shadow">
              {m.content}
            </div>
          ) : (
            <div key={i} className="max-w-[95%]">
              <div className={`rounded-2xl rounded-bl-sm border px-4 py-3 ${m.error ? "border-crimson/40 bg-crimson/5" : "border-line bg-bg"}`}>
                {m.content ? <Markdown text={m.content} sources={m.sources} /> : <span className="animate-pulse text-ink-soft">சிந்திக்கிறது… (guard → retrieve → answer)</span>}
              </div>
              {!!m.sources?.length && (
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="font-semibold text-ink-soft">ஆதாரங்கள்:</span>
                  {m.sources.map((s) => (
                    <Link key={s.id} href={`/songs/${s.workId}/${s.n}`} className="rounded-full bg-bg-soft px-2 py-0.5 font-semibold hover:bg-saffron/15">
                      {s.id} · {s.workTitle} {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={2}
          placeholder="உங்கள் கேள்வி… / Your question about the Siddhars…"
          className="flex-1 resize-none rounded-2xl border border-line bg-bg px-4 py-2 outline-none focus:ring-2 focus:ring-saffron"
        />
        {busy ? (
          <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-2xl border border-crimson px-4 font-bold text-crimson">
            Stop
          </button>
        ) : (
          <button className="rounded-2xl bg-gradient-to-r from-indigo to-peacock px-5 font-bold text-white disabled:opacity-50" disabled={!input.trim()}>
            அனுப்பு
          </button>
        )}
      </form>
    </div>
  );
}
