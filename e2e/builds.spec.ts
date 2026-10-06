import { expect, test, type Page } from "@playwright/test";

/**
 * The owner's asks (2026-10-06): the dashboards are big enough to read; every build runs backwards when you scroll
 * back and forwards again when you return, every time; the site has its own scrollbar.
 */
test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
});

const to = async (page: Page, y: number) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await page.waitForTimeout(1600);
};
const topOf = (page: Page, sel: string) =>
  page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().top + window.scrollY, sel);
/** How built a part is, by its own opacity (0 → 1). */
const built = (page: Page, sel: string) =>
  page.evaluate((s) => Number(getComputedStyle(document.querySelector(s)!).opacity), sel);

test("the hero's Today: readable size; builds, comes apart going back, builds again", async ({ page }) => {
  await page.goto("/");
  const today = page.getByRole("img", { name: /LUME's Today: the day/ });
  // LUME at ~94% of its own size: its text as large as in the app, near enough.
  const w = await today.evaluate((e) => e.getBoundingClientRect().width);
  expect(w).toBeGreaterThan(1300);
  const part = "#top [role='img'] > div:nth-child(5)";
  expect(await built(page, part)).toBeLessThan(0.05);
  for (let round = 0; round < 2; round++) {
    await to(page, 0.95 * 1.7 * 900);
    expect(await built(page, part), `round ${round}: built`).toBeGreaterThan(0.95);
    await to(page, 0);
    expect(await built(page, part), `round ${round}: apart again`).toBeLessThan(0.05);
  }
});

test("Analytics: readable size; builds, comes apart going back, builds again", async ({ page }) => {
  await page.goto("/");
  const start = await topOf(page, "#analytics");
  const overview = page.getByRole("img", { name: /Analytics overview/ });
  const w = await overview.evaluate((e) => e.getBoundingClientRect().width);
  expect(w).toBeGreaterThan(1300);
  const tile = "#analytics [role='img'] > div:nth-child(5)";
  for (let round = 0; round < 2; round++) {
    await to(page, start + 2 * 900);
    expect(await built(page, tile), `round ${round}: built`).toBeGreaterThan(0.95);
    await to(page, start - 900);
    expect(await built(page, tile), `round ${round}: apart again`).toBeLessThan(0.05);
  }
});

test("the site's own scrollbar: the browser's is gone, ours shows while scrolling", async ({ page }) => {
  await page.goto("/");
  const gutter = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  expect(gutter).toBe(0);
  const bar = page.locator("[class*='scrollbar-module'][class*='track']");
  expect(await bar.evaluate((e) => getComputedStyle(e).opacity)).toBe("0");
  await page.mouse.wheel(0, 600);
  await expect.poll(() => bar.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
});
