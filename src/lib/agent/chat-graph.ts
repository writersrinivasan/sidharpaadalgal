// LangGraph agent for the Siddhar-only AI assistant.
//
//   START → guard ─┬─ siddhar  → retrieve → answer → END
//                  ├─ greeting → answer → END
//                  └─ offtopic → refuse → END
//
// `guard` classifies the question and plans Tamil/English search terms, `retrieve` grounds the
// answer in the Project Madurai corpus and the Siddhar biographies, and `answer` writes a reply
// that cites the retrieved verses. Anything outside Siddhar literature is politely refused.
import { Annotation, END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import type { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { SIDDHARS, getSiddhar } from "@/data/siddhars";
import { getMeaning, getWorkMeta, searchVerses, worksBySiddhar } from "@/lib/corpus";

export interface Source {
  id: string;
  workId: string;
  n: number;
  label: string;
  workTitle: string;
  siddhar: string;
}

const ChatState = Annotation.Root({
  ...MessagesAnnotation.spec,
  route: Annotation<"siddhar" | "greeting" | "offtopic">(),
  searchTerms: Annotation<string[]>(),
  siddharIds: Annotation<string[]>(),
  context: Annotation<string>(),
  sources: Annotation<Source[]>(),
});
type State = typeof ChatState.State;

const SIDDHAR_DIRECTORY = SIDDHARS.map((s) => `${s.id}: ${s.nameEn} / ${s.nameTa}`).join("\n");

const routeSchema = z.object({
  route: z
    .enum(["siddhar", "greeting", "offtopic"])
    .describe("siddhar = about Tamil Siddhars, their songs, meanings, lives, philosophy, Siddha yoga or this app; greeting = hello/thanks/who are you; offtopic = anything else"),
  searchTerms: z
    .array(z.string())
    .describe("2-6 short Tamil words or phrases likely to appear verbatim in the verses (e.g. அன்பே சிவம், நட்டகல், பாம்பே). Empty for greetings/offtopic."),
  siddharIds: z.array(z.string()).describe("ids of Siddhars the question is about, from the directory"),
});

const lastUserText = (messages: BaseMessage[]) => {
  for (let i = messages.length - 1; i >= 0; i--) if (messages[i].getType() === "human") return String(messages[i].content);
  return "";
};

const TAMIL_STOPWORDS = new Set(
  "யார் யாவர் என்ன எது எந்த எங்கே எப்போது ஏன் எப்படி பற்றி பற்றிச் பொருள் பொருளை பாடல் பாடலின் பாடல்கள் சொல்லுங்கள் சொல் விளக்கம் விளக்குங்கள் கதை கதையை என்று இந்த அந்த உள்ளது இருக்கிறது காலம் காலத்தவர் சித்தர் சித்தர்கள்".split(" "),
);

// Cheap fallback if the model cannot produce structured output.
const KEYWORDS = /சித்த|சித்தர்|பாடல்|திருமந்திர|சிவவாக்|பட்டினத்|siddh|sidhar|sittar|verse|paadal|song|thirumanthiram|tirumantiram|sivavakkiyam|pattinathar|yoga|kundalini/i;
function heuristicRoute(text: string) {
  const ids = SIDDHARS.filter((s) => text.includes(s.nameTa.split(" ")[0]) || text.toLowerCase().includes(s.id)).map((s) => s.id);
  const onTopic = ids.length > 0 || KEYWORDS.test(text);
  const tamil = text.match(/[஀-௿]{3,}/g) ?? [];
  return { route: onTopic ? "siddhar" : "offtopic", searchTerms: tamil.slice(0, 5), siddharIds: ids } as const;
}

export function buildChatGraph(llm: ChatGroq) {
  async function guard(state: State): Promise<Partial<State>> {
    const question = lastUserText(state.messages);
    const recent = state.messages
      .slice(-6)
      .map((m) => `${m.getType()}: ${String(m.content).slice(0, 400)}`)
      .join("\n");
    try {
      const router = llm.withStructuredOutput(routeSchema, { name: "route_question" });
      const r = await router.invoke([
        new SystemMessage(
          `You route questions for an assistant that ONLY discusses Tamil Siddhar literature (சித்தர் பாடல்கள்): the Siddhars' songs, their meanings, the Siddhars' lives and legends, chronology, Siddha philosophy and yoga as expressed in their songs. Follow-up questions in an on-topic conversation are on-topic.\n\nSiddhar directory:\n${SIDDHAR_DIRECTORY}\n\nRecent conversation:\n${recent}`,
        ),
        { role: "user", content: question },
      ]);
      return { route: r.route, searchTerms: r.searchTerms ?? [], siddharIds: (r.siddharIds ?? []).filter((id) => getSiddhar(id)) };
    } catch {
      const h = heuristicRoute(question);
      return { route: h.route, searchTerms: [...h.searchTerms], siddharIds: [...h.siddharIds] };
    }
  }

  async function retrieve(state: State): Promise<Partial<State>> {
    const question = lastUserText(state.messages);
    const names = new Set(SIDDHARS.flatMap((s) => s.nameTa.split(/[\s()]+/)));
    const terms = [...(state.searchTerms ?? []), ...(question.match(/[஀-௿]{3,}/g) ?? [])].filter(
      (t) => !TAMIL_STOPWORDS.has(t) && !names.has(t),
    );
    // Prefer verses by the Siddhars the question is about, then fill from the whole library.
    const own = state.siddharIds?.length ? searchVerses(terms, 8, state.siddharIds) : [];
    const rest = searchVerses(terms, 8).filter((h) => !own.some((o) => o.workId === h.workId && o.verse.n === h.verse.n));
    const hits = [...own, ...rest].slice(0, 8);
    const sources: Source[] = hits.map((h, i) => ({
      id: `S${i + 1}`,
      workId: h.workId,
      n: h.verse.n,
      label: h.verse.label,
      workTitle: getWorkMeta(h.workId)!.titleTa,
      siddhar: getSiddhar(h.siddharId)?.nameTa ?? h.siddharId,
    }));
    const verseBlocks = hits.map((h, i) => {
      const meta = getWorkMeta(h.workId)!;
      const m = getMeaning(h.workId, h.verse.n);
      return [
        `[S${i + 1}] ${meta.titleTa} (${meta.titleEn}) — ${getSiddhar(h.siddharId)?.nameEn}, verse ${h.verse.label}`,
        h.verse.lines.join("\n"),
        m ? `Meaning (${m.source}): ${m.meaning.en}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    });
    const bios = (state.siddharIds ?? []).slice(0, 3).map((id) => {
      const s = getSiddhar(id)!;
      const works = worksBySiddhar(id).map((w) => `${w.titleTa} (${w.count} verses)`).join(", ");
      return `## ${s.nameEn} / ${s.nameTa}\nPeriod: ${s.eraEn} (${s.basis}; ${s.datingNote})\nSamadhi: ${s.samadhiEn ?? "unknown"}\nStory: ${s.storyEn.join(" ")}\nWorks in this library: ${works || "none in the Project Madurai corpus"}`;
    });
    const context = [bios.length ? `# Siddhar biographies\n${bios.join("\n\n")}` : "", verseBlocks.length ? `# Retrieved verses\n${verseBlocks.join("\n\n")}` : "# Retrieved verses\n(none matched)"]
      .filter(Boolean)
      .join("\n\n");
    return { context, sources };
  }

  async function answer(state: State): Promise<Partial<State>> {
    const system = new SystemMessage(
      `You are "சித்தர் துணை" (Siddhar Thunai), an assistant devoted ONLY to the Tamil Siddhars and their songs (சித்தர் பாடல்கள்).

Rules:
- Answer in the language the user writes in (Tamil, English, or Tanglish). When quoting verses, keep the original Tamil.
- Ground your answer in the CONTEXT. Cite retrieved verses as [S1], [S2]… Never invent or "reconstruct" verse text; if a verse is not in the context, say you could not find it in the library.
- Explain verses with a clear பொழிப்புரை (plain meaning) and, where useful, the inner (yogic/philosophical) meaning. Mention when interpretations differ.
- Siddhar dates are uncertain: distinguish legend, tradition and scholarly estimates.
- Be respectful of all faiths; the Siddhars criticised ritual and caste — convey this faithfully without mocking anyone.
- Do not give medical prescriptions from Siddha texts; suggest consulting a qualified Siddha physician.
- Stay on topic. Keep answers focused and well-structured (short headings or bullets are fine).

CONTEXT
${state.context ?? "(greeting — no retrieval)"}`,
    );
    const reply = await llm.invoke([system, ...state.messages.slice(-10)]);
    return { messages: [reply] };
  }

  async function refuse(): Promise<Partial<State>> {
    return {
      messages: [
        new AIMessage(
          "மன்னிக்கவும் 🙏 நான் சித்தர் பாடல்கள், சித்தர்களின் வரலாறு, அவர்களின் தத்துவம் பற்றி மட்டுமே உதவ முடியும்.\n\nSorry — I can only help with the Tamil Siddhars: their songs (paadalgal), meanings, lives and philosophy. Try asking, for example, “அன்பே சிவம் பாடலின் பொருள் என்ன?” or “Tell me the story of Pattinathar.”",
        ),
      ],
    };
  }

  return new StateGraph(ChatState)
    .addNode("guard", guard)
    .addNode("retrieve", retrieve)
    .addNode("answer", answer)
    .addNode("refuse", refuse)
    .addEdge(START, "guard")
    .addConditionalEdges("guard", (s: State) => (s.route === "offtopic" ? "refuse" : s.route === "greeting" ? "answer" : "retrieve"), ["refuse", "answer", "retrieve"])
    .addEdge("retrieve", "answer")
    .addEdge("answer", END)
    .addEdge("refuse", END)
    .compile();
}
