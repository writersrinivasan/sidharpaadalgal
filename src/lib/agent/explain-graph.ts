// LangGraph agent that writes the meaning (பொழிப்புரை) of a single verse.
//
//   START → draft → review ─┬─ approved / max attempts → END
//                           └─ needs work → draft (with reviewer feedback)
//
// Used both by the /api/explain route (on demand, with the reader's own Groq key) and by
// scripts/generate-meanings.ts (batch generation of the whole corpus).
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const meaningSchema = z.object({
  ta: z.string().describe("பொழிப்புரை: a faithful plain-prose meaning of the whole verse in clear modern Tamil"),
  en: z.string().describe("A faithful English translation/meaning of the whole verse"),
  words: z
    .array(z.object({ word: z.string(), meaning: z.string() }))
    .describe("3-8 difficult or symbolic words from the verse with short Tamil meanings"),
  note: z.string().optional().describe("Optional: inner/yogic meaning or a note where interpretations differ"),
});
export type DraftMeaning = z.infer<typeof meaningSchema>;

const reviewSchema = z.object({
  approved: z.boolean(),
  feedback: z.string().describe("Concrete problems to fix: lines left out, mistranslated words, invented content. Empty if approved."),
});

export interface ExplainInput {
  verse: string;
  workTitle: string;
  siddharName: string;
  siddharContext: string;
  section?: string;
  gloss?: string[];
}

const ExplainState = Annotation.Root({
  input: Annotation<ExplainInput>(),
  draft: Annotation<DraftMeaning | undefined>(),
  feedback: Annotation<string>(),
  attempts: Annotation<number>({ reducer: (a, b) => a + b, default: () => 0 }),
  approved: Annotation<boolean>(),
});
type State = typeof ExplainState.State;

const MAX_ATTEMPTS = 2;

function describe(input: ExplainInput) {
  return [
    `Work: ${input.workTitle} by ${input.siddharName}`,
    input.section ? `Section: ${input.section}` : "",
    `About the Siddhar: ${input.siddharContext}`,
    input.gloss?.length ? `Editor's glossary for this verse: ${input.gloss.join("; ")}` : "",
    `\nVERSE:\n${input.verse}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildExplainGraph(llm: ChatGroq) {
  async function draft(state: State): Promise<Partial<State>> {
    const writer = llm.withStructuredOutput(meaningSchema, { name: "verse_meaning" });
    const out = await writer.invoke([
      new SystemMessage(
        "You are a scholar of classical Tamil and Siddhar literature (சித்தர் இலக்கியம்). Write the meaning of the verse the way traditional commentators write a பொழிப்புரை: cover every line, resolve sandhi (split joined words), keep the Siddhar's imagery, and do not add ideas that are not in the verse. Where the verse is a yogic allegory, give the literal meaning first, then the inner meaning in `note`.",
      ),
      new HumanMessage(
        describe(state.input) +
          (state.feedback ? `\n\nA reviewer rejected your previous draft. Fix these issues:\n${state.feedback}\n\nPrevious draft:\n${JSON.stringify(state.draft)}` : ""),
      ),
    ]);
    return { draft: out, attempts: 1 };
  }

  async function review(state: State): Promise<Partial<State>> {
    const reviewer = llm.withStructuredOutput(reviewSchema, { name: "review_meaning" });
    const out = await reviewer.invoke([
      new SystemMessage(
        "You review meanings of Tamil Siddhar verses. Approve only if the Tamil and English meanings cover every line of the verse, do not misread key words, and invent nothing. Minor stylistic issues are fine — approve those.",
      ),
      new HumanMessage(`${describe(state.input)}\n\nDRAFT MEANING:\n${JSON.stringify(state.draft, null, 1)}`),
    ]);
    return { approved: out.approved, feedback: out.feedback };
  }

  return new StateGraph(ExplainState)
    .addNode("draft", draft)
    .addNode("review", review)
    .addEdge(START, "draft")
    .addEdge("draft", "review")
    .addConditionalEdges("review", (s: State) => (s.approved || s.attempts >= MAX_ATTEMPTS ? END : "draft"), ["draft", END])
    .compile();
}

export async function explainVerse(llm: ChatGroq, input: ExplainInput) {
  const result = await buildExplainGraph(llm).invoke({ input });
  if (!result.draft) throw new Error("The model did not return a meaning.");
  return { ...result.draft, reviewed: !!result.approved, attempts: result.attempts };
}
