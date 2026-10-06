import { expect, test, type Locator } from "@playwright/test";

/** The Island's morph lands on its content's own width, quickly, and stays there (no chasing its own size). */
async function settles(nav: Locator) {
  const widths: number[] = [];
  for (let i = 0; i < 20; i++) {
    widths.push(Math.round(await nav.evaluate((n) => n.getBoundingClientRect().width)));
    await nav.page().waitForTimeout(50);
  }
  return widths;
}

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "chromium" && info.project.name !== "webkit");
  await page.setViewportSize({ width: 1440, height: 900 });
});

test("scrolling away: wide → compact settles within a second and holds still", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("nav[aria-label='Main']");
  const wide = Math.round(await nav.evaluate((n) => n.getBoundingClientRect().width));
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(4000);
  const w = await settles(nav);
  expect(Math.max(...w) - Math.min(...w), `still moving: ${w.join(",")}`).toBeLessThanOrEqual(1);
  expect(w[0]!).toBeLessThan(wide * 0.6);
});

test("hover opens it wide, leaving closes it back to compact, both settle", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("nav[aria-label='Main']");
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(4000);
  const compact = (await settles(nav))[0]!;
  await page.mouse.move(720, 40);
  await page.waitForTimeout(4000);
  const open = await settles(nav);
  expect(Math.max(...open) - Math.min(...open), `still moving: ${open.join(",")}`).toBeLessThanOrEqual(1);
  expect(open[0]!).toBeGreaterThan(compact * 1.6);
  await page.mouse.move(720, 600);
  await page.waitForTimeout(4000);
  const back = await settles(nav);
  expect(Math.max(...back) - Math.min(...back), `still moving: ${back.join(",")}`).toBeLessThanOrEqual(1);
  expect(Math.abs(back.at(-1)! - compact)).toBeLessThanOrEqual(1);
});
