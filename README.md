# சித்தர் பாடல்கள் · Tamil Siddhar Songs

A colourful Next.js library of the songs of the Tamil Siddhars. It has the full open-source texts, chronological ordering, meanings, Siddhar life stories in order of years, and an AI assistant that answers only about the Siddhars. The assistant is built with LangGraph and runs on Groq with your own key.

## What's inside

| | |
|---|---|
| **Texts** | 5,478 verses in 40 works by 26 Siddhar authors, parsed from [Project Madurai](https://www.projectmadurai.org/) e-texts (kept unmodified in `sources/projectmadurai/`) |
| **Chronology** | Works ordered by the period of their Siddhar. 34 Siddhar biographies (Tamil + English) on a timeline, each labelled *legend*, *tradition* or *scholarly estimate* |
| **Meanings** | 48 key verses have hand-written Tamil பொழிப்புரை and English meanings. Every other verse can be explained on demand by a LangGraph agent |
| **AI assistant** | A LangGraph state graph that answers only questions about the Siddhars and cites the verses it uses |

### Pages
`/` home and verse of the day · `/songs` all works in chronological order · `/songs/[work]` verses with section filter and pagination · `/songs/[work]/[n]` a single verse · `/siddhars` and `/siddhars/[id]` life stories · `/timeline` stories in order of years · `/search` Tamil full-text search · `/assistant` the AI guide · `/about` sources and caveats

## Agentic AI (LangGraph.js + Groq)

**Chat agent:** `src/lib/agent/chat-graph.ts`
```
START → guard ─┬─ siddhar  → retrieve → answer → END
               ├─ greeting → answer → END
               └─ offtopic → refuse → END
```
- `guard` classifies the question with structured output and plans Tamil search terms. If structured output fails, it falls back to keyword rules.
- `retrieve` searches the verse corpus, preferring the Siddhar the question names, and adds that Siddhar's biography.
- `answer` streams a grounded reply that cites verses as `[S1]…`. It is told never to invent verses or prescribe medicines.

**Explain agent:** `src/lib/agent/explain-graph.ts`
```
START → draft → review ─┬─ approved / 2 attempts → END
                        └─ needs work → draft (with feedback)
```

### BYOK: bring your own Groq key
Open **AI துணை → 🔑 Add Groq key** and paste a key from <https://console.groq.com/keys>. The key is stored only in your browser's localStorage. It goes to this app's API routes in the `x-groq-api-key` header, which pass it on to Groq and never store it. You can also set `GROQ_API_KEY` on the server as a fallback (see `.env.example`).

## Running

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

### Scripts
```bash
npm run corpus         # re-parse sources/projectmadurai → src/data/corpus/*.json
npm run test:agent     # offline check of the chat graph with a fake model (no key needed)
GROQ_API_KEY=gsk_... npm run meanings -- --work sivavakkiyam --limit 20
                       # batch-generate AI meanings for the whole corpus (resumable) into src/data/ai-meanings/
```

## Known gaps and caveats
- The Project Madurai Thirumanthiram e-text omits verses 1155–1418.
- Bogar, Korakkar, Karuvoorar and some others have no texts in Project Madurai, so they appear with stories only.
- The verse parser uses rules to split verses, so a heading is occasionally merged into a verse.
- Siddhar dates are uncertain and disputed. AI meanings are study aids; check them against a traditional commentary.

## Structure
```
sources/projectmadurai/   original e-texts (headers intact)
scripts/                  build-corpus.mjs, generate-meanings.ts, smoke-graph.ts
src/data/                 corpus/*.json, siddhars.ts (biographies), meanings.ts (curated)
src/lib/                  corpus.ts (loading, search), settings.ts (BYOK), agent/ (LangGraph)
src/app/                  pages + api/chat (NDJSON stream) + api/explain
```
