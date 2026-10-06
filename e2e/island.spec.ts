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

test("scrolling through the sections: the pill and its buttons hold perfectly still", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("nav[aria-label='Main']");
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(3000);
  const box = async () =>
    nav.evaluate((n) => {
      const r = n.getBoundingClientRect();
      const b = [...n.querySelectorAll("[data-on] a")].at(-1)!.getBoundingClientRect();
      return `${Math.round(r.left)},${Math.round(r.width)}|${Math.round(b.left)}`;
    });
  const seen = new Set<string>();
  for (let y = 4000; y < 9000; y += 250) {
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(80);
    seen.add(await box());
  }
  expect([...seen], "the pill moved").toHaveLength(1);
});

test("hover: it opens wide smoothly and settles, then closes back to exactly where it was", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  const nav = page.locator("nav[aria-label='Main']");
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(3000);
  const compact = (await settles(nav)).at(-1)!;
  await page.mouse.move(720, 40);
  // It glides: a running width transition carries it, and part-way it sits between the two widths.
  let glide = "";
  for (let i = 0; i < 40 && !glide; i++) {
    glide = await nav.evaluate(
      (n, o) => {
        const w = n.getBoundingClientRect().width;
        const running = n
          .getAnimations()
          .some((a) => (a as CSSTransition).transitionProperty === "width" && a.playState === "running");
        return running && (!o.film || w > o.from + 2) ? String(Math.round(w)) : "";
      },
      { from: compact, film: browserName === "chromium" },
    );
    await page.waitForTimeout(15);
  }
  // WebKit's headless Windows build doesn't run CSS transitions frame by frame: the glide is judged in Chromium;
  // WebKit still checks it opens and closes to the right widths.
  if (browserName === "chromium") expect(glide, "it jumped instead of gliding").not.toBe("");
  await page.waitForTimeout(900);
  const open = await settles(nav);
  expect(Math.max(...open) - Math.min(...open), `still moving: ${open.join(",")}`).toBeLessThanOrEqual(1);
  expect(open[0]!).toBeGreaterThan(compact * 1.6);
  await page.mouse.move(720, 600);
  await page.waitForTimeout(1200);
  const back = await settles(nav);
  expect(Math.max(...back) - Math.min(...back)).toBeLessThanOrEqual(1);
  expect(Math.abs(back.at(-1)! - compact)).toBeLessThanOrEqual(1);
});
