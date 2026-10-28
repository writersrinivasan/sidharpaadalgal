import { explainVerse } from "@/lib/agent/explain-graph";
import { buildExplainInput } from "@/lib/agent/explain-input";
import { createModel, keyFromRequest, MissingKeyError } from "@/lib/agent/model";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { workId, n, model } = (await req.json().catch(() => ({}))) as { workId?: string; n?: number; model?: string };
  const input = workId && n ? buildExplainInput(workId, Number(n)) : undefined;
  if (!input) return Response.json({ error: "Unknown verse" }, { status: 404 });

  try {
    const llm = createModel({ apiKey: keyFromRequest(req), model, temperature: 0.2 });
    const meaning = await explainVerse(llm, input);
    return Response.json({ meaning, model: llm.model });
  } catch (e) {
    if (e instanceof MissingKeyError) return Response.json({ error: e.message }, { status: 401 });
    const message = e instanceof Error ? e.message : String(e);
    const status = /401|invalid api key/i.test(message) ? 401 : /429|rate/i.test(message) ? 429 : 500;
    return Response.json({ error: status === 401 ? "Groq rejected the API key." : message }, { status });
  }
}
