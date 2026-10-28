import type { Metadata } from "next";
import Link from "next/link";
import { CURATED_COUNT } from "@/data/meanings";
import { TOTAL_VERSES, WORKS } from "@/lib/corpus";

export const metadata: Metadata = { title: "பற்றி · About this library" };

export default function AboutPage() {
  const sources = [...new Set(WORKS.flatMap((w) => w.source))].sort();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 leading-relaxed">
      <h1 className="text-4xl font-extrabold">
        <span className="text-gradient">இந்த நூலகம் பற்றி</span>
      </h1>

      <h2 className="mt-8 text-2xl font-bold">📜 Texts</h2>
      <p className="mt-2">
        All {TOTAL_VERSES.toLocaleString()} verses come from{" "}
        <a href="https://www.projectmadurai.org/" className="font-semibold text-saffron underline" target="_blank" rel="noreferrer">
          Project Madurai
        </a>
        , “an open, voluntary, worldwide initiative devoted to preparation of electronic texts of Tamil literary works and to distribute them free on the
        Internet”. The original files are kept unmodified (headers intact) in <code>sources/projectmadurai/</code>, and{" "}
        <code>scripts/build-corpus.mjs</code> splits them into verses. Files used:
      </p>
      <p className="mt-2 flex flex-wrap gap-1.5 text-xs">
        {sources.map((s) => (
          <span key={s} className="rounded bg-bg-soft px-1.5 py-0.5 font-mono">
            {s}
          </span>
        ))}
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        Known gaps: the Project Madurai Thirumanthiram e-text omits verses 1155–1418; works attributed to Bogar, Korakkar, Karuvoorar and some others are not in
        the Project Madurai collection, so those Siddhars appear with their stories only. Automatic verse splitting may occasionally merge a heading into a verse —
        corrections are welcome.
      </p>

      <h2 className="mt-8 text-2xl font-bold">🕰️ Chronology</h2>
      <p className="mt-2">
        Songs are ordered by the period of their Siddhar. Siddhar dates are uncertain and disputed; every date is labelled as <b>legend</b>, <b>tradition</b> or{" "}
        <b>scholarly estimate</b>, with a note on what it rests on. Within the “Siddhar period” (roughly 10th–18th century) many relative positions are guesses.
      </p>

      <h2 className="mt-8 text-2xl font-bold">📖 Meanings</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <b className="text-leaf">Curated</b> — {CURATED_COUNT} key verses have hand-written Tamil பொழிப்புரை and English meanings.
        </li>
        <li>
          <b className="text-indigo">AI draft</b> — any other verse can be explained on demand. A LangGraph agent drafts a meaning (with word glossary), a
          reviewer node checks it against the verse, and it redrafts if needed. Treat these as study aids and verify with a traditional commentary.
        </li>
        <li>
          Batch mode: <code>GROQ_API_KEY=… npx tsx scripts/generate-meanings.ts</code> runs the same agent over the whole corpus and saves the drafts to{" "}
          <code>src/data/ai-meanings/</code>, which the site then shows.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-bold">🤖 The AI assistant</h2>
      <p className="mt-2">
        The <Link href="/assistant" className="font-semibold text-saffron underline">assistant</Link> is a LangGraph state graph:{" "}
        <code>guard → retrieve → answer</code> (or <code>guard → refuse</code> for off-topic questions). It runs on Groq with <b>your own key</b> (BYOK), kept only
        in your browser and forwarded per request. It is instructed not to invent verses and not to give medical prescriptions from Siddha texts.
      </p>
    </div>
  );
}
