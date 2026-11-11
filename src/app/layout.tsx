import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import { ScrollBar } from "@/components/ScrollBar";
import type { ReactNode } from "react";
import { structuredData } from "@/lib/structured-data";
import { themeScript } from "@/theme/theme-script";
import "@/styles/global.css";

/** The site's voice: one clean grotesk, heavy and tight in headlines, plain at reading sizes. */
const display = Host_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
/** LUME's own typeface, for the screens rebuilt in HTML (they read as the real app). */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lumecrm.in"),
  title: "LUME — lead management for teams that sell on WhatsApp",
  description:
    "LUME gathers every lead into one list, lets LUME AI answer on WhatsApp inside the rules you set, and books the call. Your own LUME, on your own server.",
  icons: { icon: "/lume-mark.png", apple: "/lume-mark.png" },
  openGraph: {
    type: "website",
    siteName: "LUME",
    url: "https://lumecrm.in",
    title: "LUME — every lead, answered while it's still warm",
    description:
      "Every lead in one list, LUME AI answering on WhatsApp inside your rules, calls booked on your calendar. Your own LUME, on your own server.",
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
    <html lang="en" className={`${display.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JavaScript nothing builds with the scroll: show every built piece finished. */}
        <noscript>
          <style>
            {
              "[data-rise]{animation:none!important}[data-scrub] span{opacity:1!important}[data-tilt]{transform:none!important;opacity:1!important}"
            }
          </style>
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
