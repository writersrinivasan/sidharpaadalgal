import { ChatGroq } from "@langchain/groq";
import { DEFAULT_MODEL } from "./model-ids";

export { GROQ_MODELS, DEFAULT_MODEL } from "./model-ids";

export class MissingKeyError extends Error {
  constructor() {
    super("No Groq API key. Add your key in the assistant settings (BYOK) or set GROQ_API_KEY on the server.");
  }
}

/**
 * Bring-your-own-key: the browser sends its key per request in the `x-groq-api-key` header.
 * The key is used only for this request and is never stored or logged on the server.
 */
export function createModel(opts: { apiKey?: string | null; model?: string | null; temperature?: number }) {
  const apiKey = opts.apiKey?.trim() || process.env.GROQ_API_KEY;
  if (!apiKey) throw new MissingKeyError();
  return new ChatGroq({
    apiKey,
    model: opts.model?.trim() || DEFAULT_MODEL,
    temperature: opts.temperature ?? 0.3,
    maxRetries: 2,
  });
}

export function keyFromRequest(req: Request) {
  return req.headers.get("x-groq-api-key");
}
