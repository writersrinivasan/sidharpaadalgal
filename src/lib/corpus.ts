import fs from "node:fs";
import path from "node:path";
import indexJson from "@/data/corpus/index.json";
import { SIDDHARS, getSiddhar } from "@/data/siddhars";
import { getCuratedMeaning, type Meaning } from "@/data/meanings";

export interface Verse {
  n: number;
  label: string;
  section?: string;
  lines: string[];
  notes?: string[];
  gloss?: string[];
}

export interface WorkMeta {
  id: string;
  siddhar: string;
  titleTa: string;
  titleEn: string;
  count: number;
  source: string[];
}

export interface Work extends Omit<WorkMeta, "count"> {
  intro?: string;
  verses: Verse[];
}

export interface AiMeaning extends Meaning {
  words?: { word: string; meaning: string }[];
  model?: string;
  generatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "src/data");
const siddharYear = new Map(SIDDHARS.map((s) => [s.id, s.sortYear]));

/** All works, ordered chronologically by their Siddhar's period (stable within a Siddhar). */
export const WORKS: WorkMeta[] = (indexJson as WorkMeta[])
  .map((w, i) => ({ w, i }))
  .sort((a, b) => (siddharYear.get(a.w.siddhar) ?? 9999) - (siddharYear.get(b.w.siddhar) ?? 9999) || a.i - b.i)
  .map(({ w }) => w);

export const TOTAL_VERSES = WORKS.reduce((a, w) => a + w.count, 0);

export function getWorkMeta(id: string) {
  return WORKS.find((w) => w.id === id);
}

export function worksBySiddhar(siddharId: string) {
  return WORKS.filter((w) => w.siddhar === siddharId);
}

const workCache = new Map<string, Work>();
export function getWork(id: string): Work | undefined {
  if (!getWorkMeta(id)) return undefined;
  let w = workCache.get(id);
  if (!w) {
    w = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "corpus", `${id}.json`), "utf8")) as Work;
    workCache.set(id, w);
  }
  return w;
}

export function getVerse(workId: string, n: number) {
  return getWork(workId)?.verses[n - 1];
}

export function getAiMeanings(workId: string): Record<string, AiMeaning> {
  const f = path.join(DATA_DIR, "ai-meanings", `${workId}.json`);
  if (!fs.existsSync(f)) return {};
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return {};
  }
}

export type MeaningSource = "curated" | "ai";
export function getMeaning(workId: string, n: number): { meaning: AiMeaning; source: MeaningSource } | undefined {
  const c = getCuratedMeaning(workId, n);
  if (c) return { meaning: c, source: "curated" };
  const a = getAiMeanings(workId)[n];
  if (a) return { meaning: a, source: "ai" };
  return undefined;
}

export function siddharOfWork(workId: string) {
  const w = getWorkMeta(workId);
  return w ? getSiddhar(w.siddhar) : undefined;
}

// --------------------------------------------------------------------------- search
const squash = (s: string) => s.toLowerCase().replace(/[\s‌‍.,;:!?'"()\-–—…]+/g, "");

export interface SearchHit {
  workId: string;
  workTitle: string;
  siddharId: string;
  verse: Verse;
  score: number;
}

/**
 * Plain substring search over every verse. Spaces are ignored because the source texts
 * split words inconsistently (e.g. "நட்டகல்லை" vs "நட்ட கல்லை").
 */
export function searchVerses(query: string | string[], limit = 50, onlySiddhars?: string[]): SearchHit[] {
  const terms = (Array.isArray(query) ? query : [query]).map(squash).filter((t) => t.length >= 2);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const meta of WORKS) {
    if (onlySiddhars?.length && !onlySiddhars.includes(meta.siddhar)) continue;
    const work = getWork(meta.id)!;
    for (const v of work.verses) {
      const text = squash(v.lines.join(""));
      let score = 0;
      for (const t of terms) if (text.includes(t)) score += t.length;
      if (score) hits.push({ workId: meta.id, workTitle: meta.titleTa, siddharId: meta.siddhar, verse: v, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Deterministic "verse of the day" chosen from the curated set so it always has a meaning. */
export function verseOfTheDay(date = new Date()) {
  const curated: { workId: string; n: number }[] = [];
  for (const meta of WORKS) {
    for (let n = 1; n <= meta.count; n++) if (getCuratedMeaning(meta.id, n)) curated.push({ workId: meta.id, n });
  }
  const day = Math.floor(date.getTime() / 86_400_000);
  return curated[day % curated.length];
}
