import type { Metadata } from "next";
import Link from "next/link";
import { ERAS, SIDDHARS_BY_YEAR, eraOf } from "@/data/siddhars";
import { BasisBadge, SiddharAvatar } from "@/components/siddhar-card";
import { worksBySiddhar } from "@/lib/corpus";

export const metadata: Metadata = { title: "காலவரிசை · Timeline of the Siddhars" };

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">
        <span className="text-gradient">சித்தர்களின் கதைகள் — காலவரிசையில்</span>
      </h1>
      <p className="mt-2 max-w-3xl text-ink-soft">
        The stories of the Siddhars in order of years. Dating the Siddhars is difficult: legends make some of them thousands of years old, while modern
        scholarship places most Siddhar songs between the 10th and 18th centuries. Every entry is labelled{" "}
        <BasisBadge basis="legendary" /> <BasisBadge basis="traditional" /> or <BasisBadge basis="scholarly" /> so you can see what its date rests on.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {ERAS.map((e) => (
          <a key={e.id} href={`#${e.id}`} className="rounded-full border border-line bg-card px-3 py-1 text-sm font-semibold hover:shadow" style={{ color: e.color }}>
            ● {e.ta}
          </a>
        ))}
      </div>

      <ol className="relative mt-10 border-l-4 border-dashed border-line pl-6 sm:pl-10">
        {SIDDHARS_BY_YEAR.map((s, i) => {
          const era = eraOf(s);
          const firstOfEra = i === 0 || eraOf(SIDDHARS_BY_YEAR[i - 1]).id !== era.id;
          const works = worksBySiddhar(s.id);
          return (
            <li key={s.id} className="mb-10">
              {firstOfEra && (
                <h2 id={era.id} className="-ml-6 mb-6 scroll-mt-24 sm:-ml-10">
                  <span className="inline-block rounded-r-full px-5 py-2 text-lg font-extrabold text-white shadow" style={{ background: era.color }}>
                    {era.ta} · <span className="font-semibold">{era.en}</span>
                  </span>
                </h2>
              )}
              <span
                className="absolute -left-[14px] mt-5 h-6 w-6 rounded-full border-4 border-bg shadow"
                style={{ background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})` }}
                aria-hidden
              />
              <article className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <SiddharAvatar s={s} size={48} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold">
                      <Link href={`/siddhars/${s.id}`} className="hover:underline">
                        {s.nameTa}
                      </Link>{" "}
                      <span className="text-base font-normal text-ink-soft">{s.nameEn}</span>
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: s.colors[1] }}>
                      {s.eraTa} · {s.eraEn}
                    </p>
                  </div>
                  <BasisBadge basis={s.basis} />
                </div>
                <p className="mt-3 leading-relaxed">{s.storyTa[0]}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.storyEn[0]}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <Link href={`/siddhars/${s.id}`} className="font-semibold text-saffron hover:underline">
                    முழுக் கதை · Full story →
                  </Link>
                  {works.map((w) => (
                    <Link key={w.id} href={`/songs/${w.id}`} className="rounded-full bg-bg-soft px-2.5 py-0.5 text-xs font-semibold hover:underline">
                      📜 {w.titleTa}
                    </Link>
                  ))}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
