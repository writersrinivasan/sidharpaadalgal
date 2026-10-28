import { getSiddhar } from "@/data/siddhars";
import { getVerse, getWorkMeta } from "@/lib/corpus";
import type { ExplainInput } from "./explain-graph";

export function buildExplainInput(workId: string, n: number): ExplainInput | undefined {
  const meta = getWorkMeta(workId);
  const verse = getVerse(workId, n);
  if (!meta || !verse) return undefined;
  const s = getSiddhar(meta.siddhar);
  return {
    verse: verse.lines.join("\n"),
    workTitle: `${meta.titleTa} (${meta.titleEn}), verse ${verse.label}`,
    siddharName: s ? `${s.nameTa} (${s.nameEn})` : meta.siddhar,
    siddharContext: s ? `${s.epithetEn}. ${s.eraEn}. Themes: ${s.themes.map((t) => t.en).join(", ")}.` : "",
    section: verse.section,
    gloss: verse.gloss,
  };
}
