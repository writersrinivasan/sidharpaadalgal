import type { Metadata } from "next";
import Link from "next/link";
import { eraOf, getSiddhar } from "@/data/siddhars";
import { CURATED_MEANINGS } from "@/data/meanings";
import { SiddharAvatar } from "@/components/siddhar-card";
import { TOTAL_VERSES, WORKS, getAiMeanings } from "@/lib/corpus";

export const metadata: Metadata = { title: "பாடல்கள் · All Siddhar songs" };

export default function SongsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">
        <span className="text-gradient">சித்தர் பாடல்கள்</span>
      </h1>
      <p className="mt-2 max-w-3xl text-ink-soft">
        {WORKS.length} நூல்கள், {TOTAL_VERSES.toLocaleString()} பாடல்கள் — பாடியவரின் காலவரிசைப்படி. All {WORKS.length} works and{" "}
        {TOTAL_VERSES.toLocaleString()} verses in the library, arranged in chronological order of their Siddhar.
      </p>

      <div className="mt-8 space-y-3">
        {WORKS.map((w, i) => {
          const s = getSiddhar(w.siddhar)!;
          const header = i === 0 || WORKS[i - 1].siddhar !== w.siddhar;
          const meanings = Object.keys(CURATED_MEANINGS[w.id] ?? {}).length + Object.keys(getAiMeanings(w.id)).length;
          return (
            <div key={w.id}>
              {header && (
                <Link href={`/siddhars/${s.id}`} className="mt-8 mb-3 flex items-center gap-3">
                  <SiddharAvatar s={s} size={40} />
                  <span>
                    <span className="block text-xl font-bold">{s.nameTa}</span>
                    <span className="block text-xs text-ink-soft">
                      {s.nameEn} · {s.eraEn} · <span style={{ color: eraOf(s).color }}>{eraOf(s).en}</span>
                    </span>
                  </span>
                </Link>
              )}
              <Link
                href={`/songs/${w.id}`}
                className="group ml-0 flex items-center gap-4 rounded-xl border border-line bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:ml-12"
              >
                <span className="h-12 w-1.5 shrink-0 rounded-full" style={{ background: `linear-gradient(${s.colors[0]}, ${s.colors[1]})` }} />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{w.titleTa}</span>
                  <span className="block text-sm text-ink-soft">{w.titleEn}</span>
                </span>
                <span className="text-right text-sm">
                  <span className="block font-bold" style={{ color: s.colors[1] }}>
                    {w.count.toLocaleString()} பாடல்கள்
                  </span>
                  <span className="block text-xs text-ink-soft">{meanings ? `${meanings} with meaning` : "AI meanings on demand"}</span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
