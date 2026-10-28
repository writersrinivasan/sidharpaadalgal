// Batch-generates meanings for every verse with the LangGraph explain agent (draft → review loop)
// and saves them to src/data/ai-meanings/<work>.json. Resumable: verses already done are skipped.
//
//   GROQ_API_KEY=gsk_... npx tsx scripts/generate-meanings.ts                 # everything
//   GROQ_API_KEY=gsk_... npx tsx scripts/generate-meanings.ts --work sivavakkiyam --limit 20
//   options: --model <groq model>  --delay <ms between verses, default 2500>
import fs from "node:fs";
import path from "node:path";
import { getCuratedMeaning } from "@/data/meanings";
import { WORKS } from "@/lib/corpus";
import { explainVerse } from "@/lib/agent/explain-graph";
import { buildExplainInput } from "@/lib/agent/explain-input";
import { createModel } from "@/lib/agent/model";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const OUT = path.join(process.cwd(), "src/data/ai-meanings");
const onlyWork = opt("work");
const limit = Number(opt("limit") ?? Infinity);
const delay = Number(opt("delay") ?? 2500);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const llm = createModel({ apiKey: process.env.GROQ_API_KEY, model: opt("model"), temperature: 0.2 });
  fs.mkdirSync(OUT, { recursive: true });
  let done = 0;

  for (const work of WORKS) {
    if (onlyWork && work.id !== onlyWork) continue;
    const file = path.join(OUT, `${work.id}.json`);
    const existing: Record<string, unknown> = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

    for (let n = 1; n <= work.count && done < limit; n++) {
      if (existing[n] || getCuratedMeaning(work.id, n)) continue;
      const input = buildExplainInput(work.id, n)!;
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const m = await explainVerse(llm, input);
          existing[n] = { ...m, model: llm.model, generatedAt: new Date().toISOString() };
          fs.writeFileSync(file, JSON.stringify(existing, null, 1));
          done++;
          console.log(`✓ ${work.id} #${n}${m.reviewed ? "" : " (unreviewed)"}`);
          break;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          const wait = /429|rate/i.test(msg) ? 30_000 * (attempt + 1) : 5_000;
          console.warn(`! ${work.id} #${n}: ${msg.slice(0, 120)} — retrying in ${wait / 1000}s`);
          await sleep(wait);
        }
      }
      await sleep(delay);
    }
  }
  console.log(`Generated ${done} meanings.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
