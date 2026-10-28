import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { notFound } from "next/navigation";
import { getSiddhar } from "@/data/siddhars";
import { SiddharAvatar } from "@/components/siddhar-card";
import { VerseCard } from "@/components/verse-card";
import { getWork } from "@/lib/corpus";

const PER_PAGE = 25;

export async function generateMetadata({ params }: PageProps<"/songs/[work]/[n]">): Promise<Metadata> {
  const { work, n } = await params;
  const w = getWork(work);
  const v = w?.verses[Number(n) - 1];
  return { title: w && v ? `${w.titleTa} ${v.label}` : "Verse", description: v?.lines.join(" ") };
}

async function VerseContent({ params }: PageProps<"/songs/[work]/[n]">) {
  const { work: workId, n: nStr } = await params;
  const work = getWork(workId);
  const n = Number(nStr);
  const verse = work?.verses[n - 1];
  if (!work || !verse) notFound();
  const s = getSiddhar(work.siddhar)!;
  const prev = work.verses[n - 2];
  const next = work.verses[n];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        <Link href="/songs" className="hover:underline">
          பாடல்கள்
        </Link>
        /
        <Link href={`/songs/${workId}?page=${Math.ceil(n / PER_PAGE)}#v${n}`} className="hover:underline">
          {work.titleTa}
        </Link>
        / <span className="font-semibold text-ink">{verse.label}</span>
      </nav>

      <Link href={`/siddhars/${s.id}`} className="mt-5 flex items-center gap-3">
        <SiddharAvatar s={s} size={52} />
        <span>
          <span className="block text-2xl font-extrabold">{work.titleTa}</span>
          <span className="block text-sm text-ink-soft">
            {s.nameTa} · {s.nameEn} · {s.eraEn}
          </span>
        </span>
      </Link>

      <div className="mt-6">
        <VerseCard workId={workId} verse={verse} accent={s.colors[0]} showLink={false} />
      </div>

      <Link
        href={`/assistant?q=${encodeURIComponent(`${work.titleTa} பாடல் ${verse.label}: "${verse.lines[0]}" — இதன் உள்ளர்த்தம் என்ன?`)}`}
        className="mt-5 block rounded-2xl bg-gradient-to-r from-indigo to-peacock p-4 text-center font-bold text-white shadow"
      >
        ✨ இந்தப் பாடலைப் பற்றி AI துணையிடம் கேளுங்கள் · Discuss this verse with the AI
      </Link>

      <nav className="mt-8 flex justify-between gap-4 text-sm font-semibold">
        {prev ? (
          <Link href={`/songs/${workId}/${n - 1}`} className="text-saffron hover:underline">
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/songs/${workId}/${n + 1}`} className="text-saffron hover:underline">
            {next.label} →
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function Page(props: PageProps<"/songs/[work]/[n]">) {
  return (
    <Suspense fallback={<Loading />}>
      <VerseContent {...props} />
    </Suspense>
  );
}
