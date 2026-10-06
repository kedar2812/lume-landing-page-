// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist" }),
  Inter: () => ({ variable: "font-inter" }),
}));
import { structuredData } from "@/lib/structured-data";
import { metadata } from "./layout";
import robots from "./robots";
import sitemap from "./sitemap";

describe("search and sharing (website spec §8)", () => {
  it("says what LUME is, for whom, in the title and description", () => {
    expect(metadata.title).toBe("LUME — lead management for teams that sell on WhatsApp");
    expect(String(metadata.description)).toMatch(/WhatsApp/);
    expect(metadata.openGraph?.siteName).toBe("LUME");
  });
  it("lists the three pages, and lets search engines in", () => {
    expect(sitemap().map((x) => x.url)).toEqual([
      "https://lumecrm.in/",
      "https://lumecrm.in/privacy",
      "https://lumecrm.in/terms",
    ]);
    expect(robots().sitemap).toBe("https://lumecrm.in/sitemap.xml");
  });
  it("describes the software, and never a price", () => {
    const json = JSON.stringify(structuredData());
    const app = structuredData().find((x) => x["@type"] === "SoftwareApplication")!;
    expect(app.applicationCategory).toBe("BusinessApplication");
    expect(json).not.toMatch(/offers|price/i);
  });
});
