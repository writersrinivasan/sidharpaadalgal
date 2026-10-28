"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/songs", ta: "பாடல்கள்", en: "Songs" },
  { href: "/siddhars", ta: "சித்தர்கள்", en: "Siddhars" },
  { href: "/timeline", ta: "காலவரிசை", en: "Timeline" },
  { href: "/search", ta: "தேடல்", en: "Search" },
  { href: "/about", ta: "பற்றி", en: "About" },
];

export function SiteHeader() {
  return <SiteHeaderView pathname={usePathname()} />;
}

/** Rendered with an empty pathname as the prerendered fallback while the route's URL streams in. */
export function SiteHeaderView({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="h-1 w-full bg-gradient-to-r from-saffron via-crimson to-indigo" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-saffron to-crimson text-xl font-bold text-white shadow-md">
            ௐ
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-gradient">சித்தர் பாடல்கள்</span>
            <span className="block text-xs text-ink-soft">Tamil Siddhar Songs</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                active(n.href) ? "bg-saffron/15 text-crimson" : "text-ink-soft hover:bg-bg-soft hover:text-ink"
              }`}
            >
              {n.ta}
              <span className="ml-1 text-xs font-normal opacity-70">{n.en}</span>
            </Link>
          ))}
          <Link
            href="/assistant"
            className="ml-2 rounded-full bg-gradient-to-r from-indigo to-peacock px-4 py-1.5 text-sm font-bold text-white shadow hover:opacity-90"
          >
            ✨ AI துணை
          </Link>
        </nav>

        <button
          className="rounded-lg border border-line px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-4 pb-4 md:hidden">
          {[...NAV, { href: "/assistant", ta: "✨ AI துணை", en: "Assistant" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 font-semibold ${active(n.href) ? "bg-saffron/15 text-crimson" : ""}`}
            >
              {n.ta} <span className="text-xs font-normal text-ink-soft">{n.en}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
