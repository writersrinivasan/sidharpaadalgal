import Link from "next/link";
import type { Siddhar } from "@/data/siddhars";

const BASIS_LABEL = {
  legendary: { ta: "புராணம்", en: "Legend" },
  traditional: { ta: "மரபு", en: "Tradition" },
  scholarly: { ta: "ஆய்வு", en: "Scholarly est." },
} as const;

export function SiddharAvatar({ s, size = 56 }: { s: Siddhar; size?: number }) {
  const initial = s.nameTa.replace(/^மதுரை /, "").charAt(0);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white shadow-md ring-4 ring-white/40"
      style={{ width: size, height: size, fontSize: size * 0.42, background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})` }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function BasisBadge({ basis }: { basis: Siddhar["basis"] }) {
  const b = BASIS_LABEL[basis];
  const cls =
    basis === "scholarly"
      ? "bg-leaf/15 text-leaf"
      : basis === "traditional"
        ? "bg-turmeric/20 text-[color:var(--ink)]"
        : "bg-indigo/15 text-indigo";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`} title="What the date is based on">
      {b.ta} · {b.en}
    </span>
  );
}

export function SiddharCard({ s, workCount, verseCount }: { s: Siddhar; workCount: number; verseCount: number }) {
  return (
    <Link
      href={`/siddhars/${s.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${s.colors[0]}, ${s.colors[1]})` }} />
      <div className="flex items-center gap-3">
        <SiddharAvatar s={s} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{s.nameTa}</h3>
          <p className="truncate text-sm text-ink-soft">{s.nameEn}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold" style={{ color: s.colors[1] }}>
        {s.epithetTa}
      </p>
      <p className="text-xs text-ink-soft">{s.epithetEn}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-bg-soft px-2 py-0.5 font-semibold">{s.eraTa}</span>
        <BasisBadge basis={s.basis} />
        {s.pathinen && <span className="rounded-full bg-saffron/15 px-2 py-0.5 font-semibold text-crimson">பதினெண் சித்தர்</span>}
      </div>
      <p className="mt-auto pt-4 text-xs text-ink-soft">
        {workCount ? `${workCount} நூல் · ${verseCount.toLocaleString()} பாடல்கள்` : "நூல்கள் இந்நூலகத்தில் இல்லை · story only"}
        <span className="float-right font-bold text-saffron transition group-hover:translate-x-1">→</span>
      </p>
    </Link>
  );
}
