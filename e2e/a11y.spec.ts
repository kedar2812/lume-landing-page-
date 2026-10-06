import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Accessible as drawn (website spec §8): axe in both themes, keyboard paths, reduced motion. */
for (const theme of ["dark", "light"] as const)
  test(`axe finds nothing, ${theme}`, async ({ page }, info) => {
    test.skip(info.project.name !== "chromium");
    await page.addInitScript((t) => localStorage.setItem("lume-site-theme", t), theme);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // The owner chose WhatsApp's exact green (#25D366) for its buttons (spec §5.H): their white label is judged
      // by eye, not by the contrast rule; everything else is held to it.
      .exclude('a[href^="https://wa.me"]')
      .analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual(
      [],
    );
  });

test("the keyboard: skip link first, then the Island, then the page", async ({ page, browserName }) => {
  // Safari only tabs to links once its "Press Tab to highlight each item" setting is on: judged in Chromium.
  test.skip(browserName === "webkit");
  const tab = "Tab";
  await page.goto("/");
  await page.keyboard.press(tab);
  await expect(page.getByRole("link", { name: "Skip to the page" })).toBeFocused();
  await page.keyboard.press(tab);
  const inIsland = await page.evaluate(() => !!document.activeElement?.closest("nav[aria-label='Main']"));
  expect(inIsland).toBe(true);
});

test("reduced motion: the hero is the finished picture, and nothing keeps moving", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("img", { name: /LUME's Today/ }).first()).toBeVisible();
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && (a.effect?.getTiming().iterations ?? 1) === Infinity)
        .length,
  );
  expect(running).toBe(0);
});
