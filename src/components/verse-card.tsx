import Link from "next/link";
import type { Verse } from "@/lib/corpus";
import { getMeaning } from "@/lib/corpus";
import { ExplainButton, MeaningBlock } from "./explain-button";

export function VerseCard({ workId, verse, accent, showLink = true }: { workId: string; verse: Verse; accent: string; showLink?: boolean }) {
  const m = getMeaning(workId, verse.n);
  return (
    <article id={`v${verse.n}`} className="scroll-mt-24 rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
      <header className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full px-2.5 py-0.5 font-bold text-white" style={{ background: accent }}>
          {verse.label}
        </span>
        {verse.section && <span className="rounded-full bg-bg-soft px-2.5 py-0.5 font-semibold text-ink-soft">{verse.section}</span>}
        {m?.source === "curated" && <span className="rounded-full bg-leaf/15 px-2 py-0.5 font-semibold text-leaf">✔ பொருளுடன்</span>}
        {showLink && (
          <Link href={`/songs/${workId}/${verse.n}`} className="ml-auto font-semibold text-saffron hover:underline">
            தனிப் பக்கம் →
          </Link>
        )}
      </header>

      <div className="verse text-[1.06rem] sm:text-lg">
        {verse.lines.map((l, i) => (
          <p key={i} className={i % 2 ? "pl-4 sm:pl-8" : ""}>
            {l}
          </p>
        ))}
      </div>

      {(verse.gloss?.length || verse.notes?.length) && (
        <details className="mt-3 text-sm text-ink-soft">
          <summary className="cursor-pointer font-semibold">அருஞ்சொற்பொருள் / குறிப்புகள் · Glossary &amp; notes</summary>
          <ul className="mt-2 list-disc pl-5">
            {verse.gloss?.map((g) => <li key={g}>{g}</li>)}
            {verse.notes?.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </details>
      )}

      {m ? <MeaningBlock meaning={m.meaning} source={m.source} /> : <ExplainButton workId={workId} n={verse.n} />}
    </article>
  );
}
