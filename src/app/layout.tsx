import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { structuredData } from "@/lib/structured-data";
import { themeScript } from "@/theme/theme-script";
import "@/styles/global.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

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
    { media: "(prefers-color-scheme: dark)", color: "#07080b" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </body>
    </html>
  );
}
