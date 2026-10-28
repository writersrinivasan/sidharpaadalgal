import Link from "next/link";
import { cacheLife } from "next/cache";
import { ERAS, SIDDHARS_BY_YEAR, eraOf, getSiddhar } from "@/data/siddhars";
import { CURATED_COUNT } from "@/data/meanings";
import { SiddharAvatar } from "@/components/siddhar-card";
import { MeaningBlock } from "@/components/explain-button";
import { TOTAL_VERSES, WORKS, getMeaning, getVerse, getWorkMeta, verseOfTheDay } from "@/lib/corpus";

async function VerseOfTheDay() {
  "use cache";
  cacheLife("hours");
  const votd = verseOfTheDay();
  const verse = getVerse(votd.workId, votd.n)!;
  const work = getWorkMeta(votd.workId)!;
  const vs = getSiddhar(work.siddhar)!;
  const meaning = getMeaning(votd.workId, votd.n)!;
  return (
    <div className="rainbow-border rounded-3xl p-6 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-saffron">இன்றைய பாடல் · Verse of the day</p>
      <div className="verse mt-3 text-lg">
        {verse.lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
        <SiddharAvatar s={vs} size={28} /> {vs.nameTa} · {work.titleTa} {verse.label}
      </p>
      <MeaningBlock meaning={meaning.meaning} source={meaning.source} />
      <Link href={`/songs/${votd.workId}/${votd.n}`} className="mt-3 inline-block text-sm font-semibold text-saffron hover:underline">
        முழுப் பக்கம் →
      </Link>
    </div>
  );
}

export default function Home() {
  const authors = new Set(WORKS.map((w) => w.siddhar)).size;

  const stats = [
    { n: TOTAL_VERSES.toLocaleString(), ta: "பாடல்கள்", en: "verses", c: "from-saffron to-crimson" },
    { n: WORKS.length, ta: "நூல்கள்", en: "works", c: "from-crimson to-indigo" },
    { n: authors, ta: "பாடிய சித்தர்கள்", en: "Siddhar authors", c: "from-indigo to-peacock" },
    { n: SIDDHARS_BY_YEAR.length, ta: "சித்தர் வரலாறுகள்", en: "life stories", c: "from-peacock to-leaf" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-saffron/25 blur-3xl" />
        <div className="absolute -right-16 top-10 h-80 w-80 rounded-full bg-indigo/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-peacock/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="inline-block rounded-full border border-line bg-card/70 px-3 py-1 text-xs font-semibold text-ink-soft">
              திறந்த மூல ஆன்மிக நூலகம் · Open-source spiritual library
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">சித்தர் பாடல்கள்</span>
            </h1>
            <p className="mt-3 text-xl font-semibold text-ink-soft sm:text-2xl">The Songs of the Tamil Siddhars</p>
            <p className="mt-5 max-w-xl text-ink-soft">
              திருமூலர் முதல் வாலைசாமி வரை — பதினெண் சித்தர்களும் பிற சித்தர்களும் பாடிய பாடல்கள், காலவரிசைப்படி, பொருளுடன்,
              அவர்களின் வாழ்க்கைக் கதைகளுடன். From Thirumoolar to Valaisami: every song in the Project Madurai corpus, arranged chronologically,
              with meanings, life stories and an AI guide that speaks only of the Siddhars.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/songs" className="rounded-full bg-gradient-to-r from-saffron to-crimson px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.03]">
                பாடல்களைப் படிக்க →
              </Link>
              <Link href="/timeline" className="rounded-full border-2 border-indigo px-6 py-3 font-bold text-indigo transition hover:bg-indigo/10">
                காலவரிசை
              </Link>
              <Link href="/assistant" className="rounded-full bg-gradient-to-r from-indigo to-peacock px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.03]">
                ✨ AI துணை
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="animate-float-slow absolute -right-2 -top-6 text-6xl opacity-80" aria-hidden>
              🪔
            </div>
            <VerseOfTheDay />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.en} className="rounded-2xl border border-line bg-card p-5 text-center shadow-sm">
              <p className={`bg-gradient-to-r ${s.c} bg-clip-text text-4xl font-extrabold text-transparent`}>{s.n}</p>
              <p className="mt-1 font-semibold">{s.ta}</p>
              <p className="text-xs text-ink-soft">{s.en}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">
          {CURATED_COUNT} key verses carry hand-written meanings; every other verse can be explained on demand by the LangGraph agent with your Groq key.
        </p>
      </section>

      {/* Era ribbon */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">காலவரிசையில் சித்தர்கள்</h2>
            <p className="text-ink-soft">The Siddhars through the ages</p>
          </div>
          <Link href="/timeline" className="shrink-0 font-semibold text-saffron hover:underline">
            முழுக் காலவரிசை →
          </Link>
        </div>
        <div className="mt-6 space-y-5">
          {ERAS.map((era) => {
            const list = SIDDHARS_BY_YEAR.filter((s) => eraOf(s).id === era.id);
            if (!list.length) return null;
            return (
              <div key={era.id} className="rounded-2xl border border-line bg-card p-4 shadow-sm">
                <p className="mb-3 text-sm font-bold" style={{ color: era.color }}>
                  ● {era.ta} <span className="font-normal text-ink-soft">· {era.en}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <Link
                      key={s.id}
                      href={`/siddhars/${s.id}`}
                      className="flex items-center gap-2 rounded-full border border-line bg-bg py-1 pl-1 pr-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow"
                    >
                      <SiddharAvatar s={s} size={28} />
                      {s.nameTa}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-16 grid max-w-6xl gap-5 px-4 md:grid-cols-3">
        {[
          { icon: "📜", ta: "முழுப் பாடல்கள்", en: "Complete texts", d: "Every Siddhar text from Project Madurai, parsed verse by verse, with editors' glossaries and variant readings.", href: "/songs", c: "from-saffron/20" },
          { icon: "🕰️", ta: "காலவரிசை வரலாறு", en: "Stories by year", d: "34 Siddhar biographies in order of period, with honest labels for legend, tradition and scholarly dating.", href: "/timeline", c: "from-indigo/20" },
          { icon: "🤖", ta: "சித்தர் AI துணை", en: "Siddhar-only AI", d: "A LangGraph agent (guard → retrieve → answer) on Groq that answers only about the Siddhars, citing verses.", href: "/assistant", c: "from-peacock/20" },
        ].map((f) => (
          <Link key={f.href} href={f.href} className={`rounded-2xl border border-line bg-gradient-to-br ${f.c} to-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
            <p className="text-4xl">{f.icon}</p>
            <h3 className="mt-3 text-xl font-bold">{f.ta}</h3>
            <p className="text-sm font-semibold text-ink-soft">{f.en}</p>
            <p className="mt-2 text-sm text-ink-soft">{f.d}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
