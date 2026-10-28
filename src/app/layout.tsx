import type { Metadata } from "next";
import { Catamaran, Noto_Serif_Tamil } from "next/font/google";
import { Suspense } from "react";
import { SiteHeader, SiteHeaderView } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SettingsDialog } from "@/components/settings-dialog";
import "./globals.css";

const catamaran = Catamaran({
  variable: "--font-catamaran",
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--font-noto-serif-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "சித்தர் பாடல்கள் · Tamil Siddhar Songs", template: "%s · சித்தர் பாடல்கள்" },
  description:
    "The open-source songs of the Tamil Siddhars — Thirumoolar, Sivavakkiyar, Pattinathar, Pambatti and more — in chronological order, with meanings, Siddhar stories and a Siddhar-only AI assistant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ta" className={`${catamaran.variable} ${notoSerifTamil.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<SiteHeaderView pathname="" />}>
          <SiteHeader />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SettingsDialog />
      </body>
    </html>
  );
}
