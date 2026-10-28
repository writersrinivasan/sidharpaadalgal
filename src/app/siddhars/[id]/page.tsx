import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SIDDHARS, SIDDHARS_BY_YEAR, getSiddhar } from "@/data/siddhars";
import { BasisBadge, SiddharAvatar } from "@/components/siddhar-card";
import { getWork, worksBySiddhar } from "@/lib/corpus";

export function generateStaticParams() {
  return SIDDHARS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/siddhars/[id]">): Promise<Metadata> {
  const s = getSiddhar((await params).id);
  return { title: s ? `${s.nameTa} · ${s.nameEn}` : "Siddhar" };
}

export default async function SiddharPage({ params }: PageProps<"/siddhars/[id]">) {
  const s = getSiddhar((await params).id);
  if (!s) notFound();
  const works = worksBySiddhar(s.id);
  const idx = SIDDHARS_BY_YEAR.findIndex((x) => x.id === s.id);
  const prev = SIDDHARS_BY_YEAR[idx - 1];
  const next = SIDDHARS_BY_YEAR[idx + 1];
  const related = [s.guru, ...(s.disciples ?? [])].filter(Boolean).map((id) => getSiddhar(id!)).filter(Boolean);
  const sample = works[0] ? getWork(works[0].id)?.verses.find((v) => v.lines.length >= 2) : undefined;

  return (
    <div>
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(120deg, ${s.colors[0]}, ${s.colors[1]})` }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }} />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center">
          <SiddharAvatar s={s} size={110} />
          <div>
            <p className="text-sm font-semibold opacity-90">{s.epithetEn}</p>
            <h1 className="text-4xl font-extrabold sm:text-5xl">{s.nameTa}</h1>
            <p className="mt-1 text-xl opacity-95">{s.nameEn}</p>
            <p className="mt-2 text-lg font-semibold">{s.epithetTa}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="text-2xl font-bold">வரலாறு</h2>
          <div className="prose-story mt-3 text-[1.05rem] leading-relaxed">
            {s.storyTa.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <h2 className="mt-8 text-2xl font-bold">Life & legend</h2>
          <div className="prose-story mt-3 leading-relaxed text-ink-soft">
            {s.storyEn.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {sample && works[0] && (
            <div className="rainbow-border mt-8 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-saffron">From {works[0].titleEn}</p>
              <div className="verse mt-2 text-lg">
                {sample.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          )}

          <h2 className="mt-10 text-2xl font-bold">நூல்கள் · Works</h2>
          {works.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {works.map((w) => (
                <Link key={w.id} href={`/songs/${w.id}`} className="rounded-xl border border-line bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="font-bold">{w.titleTa}</p>
                  <p className="text-sm text-ink-soft">{w.titleEn}</p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: s.colors[1] }}>
                    {w.count} பாடல்கள் →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-ink-soft">
              இவர் பெயரால் வழங்கும் நூல்கள் Project Madurai தொகுப்பில் இன்னும் இல்லை. Works attributed to {s.nameEn} are not yet in the Project Madurai
              corpus, so only the life story is shown.
            </p>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">காலம் · Period</p>
            <p className="mt-1 text-lg font-bold">{s.eraTa}</p>
            <p className="text-sm text-ink-soft">{s.eraEn}</p>
            <div className="mt-2">
              <BasisBadge basis={s.basis} />
            </div>
            <p className="mt-3 text-sm text-ink-soft">{s.datingNote}</p>
          </div>
          {s.samadhiTa && (
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">சமாதி · Samadhi</p>
              <p className="mt-1 font-semibold">{s.samadhiTa}</p>
              <p className="text-sm text-ink-soft">{s.samadhiEn}</p>
            </div>
          )}
          <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">கருத்துகள் · Themes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.themes.map((t) => (
                <span key={t.en} className="rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: s.colors[0] }}>
                  {t.ta} <span className="font-normal opacity-80">· {t.en}</span>
                </span>
              ))}
            </div>
          </div>
          {!!related.length && (
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">குரு–சீடர் · Lineage</p>
              <ul className="mt-2 space-y-2">
                {related.map((r) => (
                  <li key={r!.id}>
                    <Link href={`/siddhars/${r!.id}`} className="flex items-center gap-2 font-semibold hover:underline">
                      <SiddharAvatar s={r!} size={28} /> {r!.nameTa}
                      <span className="text-xs font-normal text-ink-soft">{r!.id === s.guru ? "guru" : "disciple"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href={`/assistant?q=${encodeURIComponent(`${s.nameTa} பற்றிச் சொல்லுங்கள்`)}`} className="block rounded-2xl bg-gradient-to-r from-indigo to-peacock p-4 text-center font-bold text-white shadow">
            ✨ Ask the AI about {s.nameEn}
          </Link>
        </aside>
      </div>

      <nav className="mx-auto flex max-w-5xl justify-between gap-4 px-4 text-sm font-semibold">
        {prev ? (
          <Link href={`/siddhars/${prev.id}`} className="text-saffron hover:underline">
            ← {prev.nameTa}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/siddhars/${next.id}`} className="text-saffron hover:underline">
            {next.nameTa} →
          </Link>
        )}
      </nav>
    </div>
  );
}
