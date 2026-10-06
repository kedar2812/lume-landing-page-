// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SCREENS, rectsFor, srcOf, type ScreenName } from "./screens";

const pub = (f: string) => path.join(process.cwd(), "public", f);

describe("the captures the page shows", () => {
  it("every screen has both themes on disk", () => {
    for (const [name, s] of Object.entries(SCREENS))
      for (const theme of ["light", "dark"] as const)
        expect([name, theme, existsSync(pub(srcOf(name as ScreenName, theme, s.phone)))]).toEqual([
          name,
          theme,
          true,
        ]);
  });
  it("every capture is the size the page reserves for it (no layout shift)", () => {
    const manifest = JSON.parse(readFileSync(pub("screens/manifest.json"), "utf8")) as {
      screens: { name: string; theme: string; phone: boolean; width: number; height: number }[];
    };
    for (const [name, s] of Object.entries(SCREENS)) {
      const base = s.phone ? name.replace(/-phone$/, "") : name;
      const m = manifest.screens.find((x) => x.name === base && x.phone === s.phone && x.theme === "light");
      expect([name, m?.width, m?.height]).toEqual([name, s.width, s.height]);
    }
  });
  it("the hero's pieces lie inside the Today capture", () => {
    for (const theme of ["light", "dark"] as const)
      for (const [k, b] of Object.entries(rectsFor(theme, false)))
        expect([k, b.x >= 0 && b.y >= 0 && b.x + b.w <= 1440 && b.y + b.h <= 900]).toEqual([k, true]);
  });
});
