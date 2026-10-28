import type { Metadata } from "next";
import { ERAS, SIDDHARS_BY_YEAR, eraOf } from "@/data/siddhars";
import { SiddharCard } from "@/components/siddhar-card";
import { worksBySiddhar } from "@/lib/corpus";

export const metadata: Metadata = { title: "சித்தர்கள் · The Siddhars" };

export default function SiddharsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">
        <span className="text-gradient">சித்தர்கள்</span>
      </h1>
      <p className="mt-2 max-w-3xl text-ink-soft">
        காலவரிசைப்படி சித்தர்கள். The Siddhars in chronological order. “பதினெண் சித்தர்” (the Eighteen) lists differ between traditions; a badge marks those
        who appear in common lists. Each card shows whether its date rests on legend, tradition or a scholarly estimate.
      </p>

      {ERAS.map((era) => {
        const list = SIDDHARS_BY_YEAR.filter((s) => eraOf(s).id === era.id);
        if (!list.length) return null;
        return (
          <section key={era.id} className="mt-10">
            <h2 className="flex items-center gap-3 text-2xl font-bold">
              <span className="h-3 w-3 rounded-full" style={{ background: era.color }} />
              {era.ta}
              <span className="text-base font-normal text-ink-soft">{era.en}</span>
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => {
                const works = worksBySiddhar(s.id);
                return <SiddharCard key={s.id} s={s} workCount={works.length} verseCount={works.reduce((a, w) => a + w.count, 0)} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
