import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { getSiddhar } from "@/data/siddhars";
import { SiddharAvatar } from "@/components/siddhar-card";
import { searchVerses } from "@/lib/corpus";

export const metadata: Metadata = { title: "தேடல் · Search" };

const SUGGESTIONS = ["அன்பே சிவம்", "நட்டகல்", "எக்காலம்", "காதற்ற ஊசி", "ஆடு பாம்பே", "குதம்பாய்", "நமசிவாய", "கண்ணம்மா"];

async function SearchContent({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const hits = q ? searchVerses(q, 100) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">
        <span className="text-gradient">பாடல் தேடல்</span>
      </h1>
      <p className="mt-2 text-ink-soft">Search all verses in Tamil. Spaces are ignored, so “நட்டகல்” also finds “நட்ட கல்”.</p>

      <form className="mt-6 flex gap-2" action="/search">
        <input
          name="q"
          defaultValue={q}
          placeholder="தமிழில் தேடுங்கள்… e.g. அன்பே சிவம்"
          className="flex-1 rounded-full border-2 border-line bg-card px-5 py-3 text-lg outline-none focus:border-saffron"
          autoFocus
        />
        <button className="rounded-full bg-gradient-to-r from-saffron to-crimson px-6 font-bold text-white">தேடு</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full bg-bg-soft px-3 py-1 text-sm font-semibold hover:bg-saffron/15">
            {s}
          </Link>
        ))}
      </div>

      {q && (
        <p className="mt-8 text-sm text-ink-soft">
          “{q}” — {hits.length === 100 ? "100+" : hits.length} பாடல்கள்
        </p>
      )}
      <div className="mt-4 space-y-4">
        {hits.map((h) => {
          const s = getSiddhar(h.siddharId)!;
          return (
            <Link
              key={`${h.workId}-${h.verse.n}`}
              href={`/songs/${h.workId}/${h.verse.n}`}
              className="block rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <SiddharAvatar s={s} size={24} /> {s.nameTa} · {h.workTitle} {h.verse.label}
              </p>
              <div className="verse mt-2">
                {h.verse.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
      {q && !hits.length && <p className="mt-6 text-ink-soft">பொருத்தமான பாடல் இல்லை. Try a shorter word, or ask the AI assistant.</p>}
    </div>
  );
}

export default function Page(props: PageProps<"/search">) {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent {...props} />
    </Suspense>
  );
}
