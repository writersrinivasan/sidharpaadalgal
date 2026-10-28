import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { notFound } from "next/navigation";
import { getSiddhar } from "@/data/siddhars";
import { SiddharAvatar } from "@/components/siddhar-card";
import { VerseCard } from "@/components/verse-card";
import { WORKS, getWork } from "@/lib/corpus";

const PER_PAGE = 25;

export async function generateMetadata({ params }: PageProps<"/songs/[work]">): Promise<Metadata> {
  const { work } = await params;
  const w = WORKS.find((x) => x.id === work);
  return { title: w ? `${w.titleTa} · ${w.titleEn}` : "Songs" };
}

async function WorkContent({ params, searchParams }: PageProps<"/songs/[work]">) {
  const { work: workId } = await params;
  const sp = await searchParams;
  const work = getWork(workId);
  if (!work) notFound();
  const s = getSiddhar(work.siddhar)!;

  // optional section filter
  const section = typeof sp.section === "string" ? sp.section : undefined;
  const verses = section ? work.verses.filter((v) => v.section === section) : work.verses;
  const pages = Math.max(1, Math.ceil(verses.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const shown = verses.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sections: { name: string; count: number }[] = [];
  for (const v of work.verses) {
    if (!v.section) continue;
    const last = sections.at(-1);
    if (last?.name === v.section) last.count++;
    else if (!sections.some((x) => x.name === v.section)) sections.push({ name: v.section, count: 1 });
  }

  const idx = WORKS.findIndex((w) => w.id === workId);
  const href = (p: number) => `/songs/${workId}?${new URLSearchParams({ ...(section ? { section } : {}), page: String(p) })}`;

  return (
    <div>
      <section className="text-white" style={{ background: `linear-gradient(120deg, ${s.colors[0]}, ${s.colors[1]})` }}>
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Link href={`/siddhars/${s.id}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 text-sm font-semibold hover:bg-white/25">
            <SiddharAvatar s={s} size={28} /> {s.nameTa} · {s.eraEn}
          </Link>
          <h1 className="mt-3 text-4xl font-extrabold">{work.titleTa}</h1>
          <p className="text-lg opacity-90">{work.titleEn}</p>
          <p className="mt-2 text-sm opacity-90">
            {work.verses.length.toLocaleString()} பாடல்கள் · Source: Project Madurai {work.source.join(", ")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {work.intro && (
          <details className="mb-6 rounded-2xl border border-line bg-card p-5 shadow-sm">
            <summary className="cursor-pointer font-bold">முன்னுரை · Editor&apos;s introduction (Project Madurai)</summary>
            <p className="mt-3 leading-relaxed text-ink-soft">{work.intro}</p>
          </details>
        )}
        {workId === "thirumanthiram" && (
          <p className="mb-6 rounded-xl border border-turmeric/50 bg-turmeric/10 p-4 text-sm">
            ⚠️ The Project Madurai e-text of Thirumanthiram omits verses 1155–1418 (the second half of the fourth Tantra); they will be added when an open
            source text is available. Verse labels follow the source edition.
          </p>
        )}

        {sections.length > 1 && (
          <details className="mb-6 rounded-2xl border border-line bg-card p-5 shadow-sm" open={!!section}>
            <summary className="cursor-pointer font-bold">
              பகுதிகள் · Sections ({sections.length}){section && <span className="ml-2 font-normal text-saffron">— {section}</span>}
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {section && (
                <Link href={`/songs/${workId}`} className="rounded-full bg-crimson px-3 py-1 text-xs font-bold text-white">
                  ✕ all sections
                </Link>
              )}
              {sections.map((x) => (
                <Link
                  key={x.name}
                  href={`/songs/${workId}?section=${encodeURIComponent(x.name)}`}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${x.name === section ? "border-saffron bg-saffron/15" : "border-line bg-bg hover:bg-bg-soft"}`}
                >
                  {x.name} <span className="text-ink-soft">{x.count}</span>
                </Link>
              ))}
            </div>
          </details>
        )}

        <div className="space-y-5">
          {shown.map((v) => (
            <VerseCard key={v.n} workId={workId} verse={v} accent={s.colors[0]} />
          ))}
        </div>

        {pages > 1 && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pages">
            {page > 1 && (
              <Link href={href(page - 1)} className="rounded-full border border-line px-3 py-1 text-sm font-semibold">
                ←
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 2)
              .map((p, i, arr) => (
                <span key={p} className="flex items-center gap-1.5">
                  {i > 0 && p - arr[i - 1] > 1 && <span className="text-ink-soft">…</span>}
                  <Link
                    href={href(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`min-w-9 rounded-full px-3 py-1 text-center text-sm font-semibold ${p === page ? "bg-gradient-to-r from-saffron to-crimson text-white" : "border border-line"}`}
                  >
                    {p}
                  </Link>
                </span>
              ))}
            {page < pages && (
              <Link href={href(page + 1)} className="rounded-full border border-line px-3 py-1 text-sm font-semibold">
                →
              </Link>
            )}
          </nav>
        )}

        <nav className="mt-10 flex justify-between gap-4 text-sm font-semibold">
          {WORKS[idx - 1] ? (
            <Link href={`/songs/${WORKS[idx - 1].id}`} className="text-saffron hover:underline">
              ← {WORKS[idx - 1].titleTa}
            </Link>
          ) : (
            <span />
          )}
          {WORKS[idx + 1] && (
            <Link href={`/songs/${WORKS[idx + 1].id}`} className="text-saffron hover:underline">
              {WORKS[idx + 1].titleTa} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return WORKS.map((w) => ({ work: w.id }));
}

export default function Page(props: PageProps<"/songs/[work]">) {
  return (
    <Suspense fallback={<Loading />}>
      <WorkContent {...props} />
    </Suspense>
  );
}
