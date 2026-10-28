// Offline check of the chat graph wiring with a fake model (no Groq key needed):
//   npm run test:agent
import { FakeListChatModel } from "@langchain/core/utils/testing";
import { HumanMessage, type AIMessageChunk, type BaseMessage } from "@langchain/core/messages";
import { buildChatGraph } from "@/lib/agent/chat-graph";

async function run(q: string) {
  const llm = new FakeListChatModel({ responses: ["அன்பே சிவம் என்பது [S1] இல் உள்ளது."] });
  const g = buildChatGraph(llm as never);
  const nodes: string[] = [];
  let text = "";
  let sources = 0;
  for await (const [mode, p] of await g.stream({ messages: [new HumanMessage(q)] }, { streamMode: ["messages", "updates"] })) {
    if (mode === "updates") {
      const u = p as { retrieve?: { sources: unknown[] }; refuse?: { messages: BaseMessage[] } };
      nodes.push(...Object.keys(u));
      if (u.retrieve) sources = u.retrieve.sources.length;
      if (u.refuse) text += String(u.refuse.messages[0].content).slice(0, 40);
    } else {
      const [c, m] = p as [AIMessageChunk, { langgraph_node?: string }];
      if (m.langgraph_node === "answer") text += c.content;
    }
  }
  console.log(JSON.stringify(q), "→", nodes.join(" → "), "| sources:", sources, "|", text.slice(0, 60));
}

async function main() {
  await run("திருமூலர் அன்பே சிவம் பாடலின் பொருள்?");
  await run("What is the capital of France?");
}
main();
