import { expect, test, type Page } from "@playwright/test";

/** Flawless at every width (website spec §8): phones, tablets, laptops, big screens — both themes. */
const WIDTHS = [
  [320, 640],
  [360, 760],
  [375, 812],
  [390, 844],
  [414, 896],
  [430, 932],
  [844, 390],
  [768, 1024],
  [820, 1180],
  [1024, 768],
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1920, 1080],
  [2560, 1440],
] as const;

/** Walk the whole page, so every scroll-built section has been on screen. */
async function walk(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
}

for (const [w, h] of WIDTHS)
  test(`${w}×${h}: nothing scrolls sideways, in either theme`, async ({ page }, info) => {
    test.skip(info.project.name !== "chromium" && ![390, 1440].includes(w), "WebKit runs the two key widths");
    for (const theme of ["dark", "light"]) {
      await page.addInitScript((t) => localStorage.setItem("lume-site-theme", t), theme);
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/");
      await walk(page);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(over, `${theme}: the page is ${over}px wider than the window`).toBeLessThanOrEqual(0);
    }
  });

test("phones: every button and link is at least 44 px tall to tap", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await walk(page);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main a, main button, nav a, nav button, footer a")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (r.width === 0 || style.visibility === "hidden" || el.closest("[aria-hidden='true'],[inert]"))
          return false;
        // Inline links in running text are exempt (WCAG 2.5.8): judge the controls.
        if (el.closest("p") && !el.className) return false;
        return r.height < 44 && r.width < 44;
      })
      .map(
        (el) =>
          `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`,
      ),
  );
  expect(small).toEqual([]);
});

test("a large system font (200%) on the smallest phone: still no sideways scroll", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await walk(page);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over).toBeLessThanOrEqual(0);
});

for (const theme of ["dark", "light"] as const)
  for (const [w, h, tag] of [
    [1440, 900, "desktop"],
    [390, 844, "phone"],
  ] as const)
    test(`review: the whole page, ${theme}, ${tag}`, async ({ page }, info) => {
      test.skip(info.project.name !== "chromium");
      await page.addInitScript((t) => localStorage.setItem("lume-site-theme", t), theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/");
      await walk(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      // Every picture loaded (they load lazily as the walk passes them) before the page is shot.
      await page.waitForFunction(() =>
        [...document.images].every((i) => i.complete || (i.loading === "lazy" && !i.getClientRects().length)),
      );
      await page.waitForTimeout(400);
      await page.screenshot({ path: `e2e/__review__/page-${theme}-${tag}.png`, fullPage: true });
    });
