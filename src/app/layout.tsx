import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import { ScrollBar } from "@/components/ScrollBar";
import type { ReactNode } from "react";
import { structuredData } from "@/lib/structured-data";
import { themeScript } from "@/theme/theme-script";
import "@/styles/global.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
/** LUME's own typeface, for the screens rebuilt in HTML (they read as the real app). */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lumecrm.in"),
  title: "LUME — lead management for teams that sell on WhatsApp",
  description:
    "LUME gathers leads from Instagram, your website and sheets, puts the next follow-up in front of the right person, and sends it on WhatsApp in one tap. Your own LUME, on your own server.",
  icons: { icon: "/lume-mark.png", apple: "/lume-mark.png" },
  openGraph: {
    type: "website",
    siteName: "LUME",
    url: "https://lumecrm.in",
    title: "LUME — every lead, answered while it's still warm",
    description:
      "Leads from every source in one list, the next follow-up on the right person's screen, WhatsApp in one tap. Your own LUME, on your own server.",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#141518" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JavaScript nothing builds with the scroll: show every built piece finished. */}
        <noscript>
          <style>{"[data-build]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        {children}
        <ScrollBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </body>
    </html>
  );
}
