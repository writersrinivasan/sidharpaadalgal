import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-bg-soft/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-ink-soft md:grid-cols-3">
        <div>
          <p className="text-base font-bold text-ink">சித்தர் பாடல்கள்</p>
          <p className="mt-2">
            ஆனவஞ் செழுத்துளே அண்டமும் அகண்டமும் — the songs of the Tamil Siddhars, freely shared.
          </p>
        </div>
        <div>
          <p className="font-bold text-ink">Sources</p>
          <p className="mt-2">
            Texts from{" "}
            <a className="underline decoration-saffron underline-offset-2" href="https://www.projectmadurai.org/" target="_blank" rel="noreferrer">
              Project Madurai
            </a>
            , an open, voluntary initiative distributing Tamil literature freely. See{" "}
            <Link href="/about" className="underline decoration-saffron underline-offset-2">
              About
            </Link>{" "}
            for details and caveats.
          </p>
        </div>
        <div>
          <p className="font-bold text-ink">AI meanings</p>
          <p className="mt-2">
            Meanings marked “AI” are drafts produced by a LangGraph agent on Groq with your own key. Hand-written meanings are marked “✔ பொழிப்புரை · Curated meaning”.
          </p>
        </div>
      </div>
    </footer>
  );
}
