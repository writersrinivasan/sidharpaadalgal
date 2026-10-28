import { Suspense } from "react";
import { Loading } from "@/components/loading";
import type { Metadata } from "next";
import { ChatPanel } from "@/components/chat-panel";

export const metadata: Metadata = { title: "AI துணை · Siddhar AI assistant" };

async function AssistantContent({ searchParams }: PageProps<"/assistant">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">
        <span className="text-gradient">சித்தர் துணை</span> <span className="text-xl text-ink-soft">· Siddhar AI</span>
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        A LangGraph agent on Groq: <b>guard</b> (only Siddhar topics) → <b>retrieve</b> (searches the verses &amp; biographies here) → <b>answer</b> (cites verses as [S1]…). Uses your own Groq key (BYOK).
      </p>
      <ChatPanel initialQuestion={q} />
    </div>
  );
}

export default function Page(props: PageProps<"/assistant">) {
  return (
    <Suspense fallback={<Loading />}>
      <AssistantContent {...props} />
    </Suspense>
  );
}
