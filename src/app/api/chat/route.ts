import { AIMessage, HumanMessage, type AIMessageChunk } from "@langchain/core/messages";
import { buildChatGraph, type Source } from "@/lib/agent/chat-graph";
import { createModel, keyFromRequest, MissingKeyError } from "@/lib/agent/model";

export const maxDuration = 60;

interface Body {
  messages: { role: "user" | "assistant"; content: string }[];
  model?: string;
}

// Streams newline-delimited JSON events:
//   {"type":"sources","sources":[...]}  {"type":"token","text":"..."}  {"type":"error","message":"..."}  {"type":"done"}
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const history = (body.messages ?? []).slice(-12).filter((m) => m.content?.trim());
  if (!history.length || history.at(-1)!.role !== "user") {
    return Response.json({ error: "The last message must be from the user." }, { status: 400 });
  }

  let llm;
  try {
    llm = createModel({ apiKey: keyFromRequest(req), model: body.model });
  } catch (e) {
    if (e instanceof MissingKeyError) return Response.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const graph = buildChatGraph(llm);
  const messages = history.map((m) => (m.role === "user" ? new HumanMessage(m.content.slice(0, 4000)) : new AIMessage(m.content)));
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        const events = await graph.stream({ messages }, { streamMode: ["messages", "updates"], signal: req.signal });
        for await (const [mode, payload] of events) {
          if (mode === "messages") {
            const [chunk, meta] = payload as [AIMessageChunk, { langgraph_node?: string }];
            if (meta.langgraph_node === "answer" && typeof chunk.content === "string" && chunk.content) {
              send({ type: "token", text: chunk.content });
            }
          } else if (mode === "updates") {
            const update = payload as Record<string, { sources?: Source[]; messages?: AIMessage[] }>;
            if (update.retrieve?.sources) send({ type: "sources", sources: update.retrieve.sources });
            if (update.refuse?.messages) send({ type: "token", text: String(update.refuse.messages[0].content) });
          }
        }
        send({ type: "done" });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        send({ type: "error", message: /401|invalid api key/i.test(message) ? "Groq rejected the API key. Please check it in settings." : message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
