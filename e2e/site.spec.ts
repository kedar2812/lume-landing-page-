import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** The redesigned page: flawless at every width, accessible as drawn, the demo form end to end. */

const WIDTHS = [
  [320, 640],
  [360, 760],
  [390, 844],
  [430, 932],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
] as const;

/** Walk the whole page, so every scroll-driven piece has been on screen at least once. */
async function walk(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
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

for (const theme of ["dark", "light"] as const)
  for (const motion of ["no-preference", "reduce"] as const)
    test(`axe finds nothing: ${theme}, motion ${motion}`, async ({ page }, info) => {
      test.skip(info.project.name !== "chromium");
      await page.addInitScript((t) => localStorage.setItem("lume-site-theme", t), theme);
      await page.emulateMedia({ reducedMotion: motion });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await walk(page);
      await page.waitForTimeout(800);
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude("nextjs-portal")
        .analyze();
      expect(
        r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });

test("the keyboard: skip link first, then the menu", async ({ page, browserName }) => {
  // Safari only tabs to links once its "Press Tab to highlight each item" setting is on: judged in Chromium.
  test.skip(browserName === "webkit");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to the page" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "LUME, back to the top" })).toBeFocused();
});

test("reduced motion: the headline is there and nothing loops", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your leads are going cold.");
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && (a.effect?.getTiming().iterations ?? 1) === Infinity)
        .length,
  );
  expect(running).toBe(0);
});

test("the demo form: four taps, then the details, and the answers reach the enquiry", async ({ page }) => {
  let posted: Record<string, unknown> | null = null;
  await page.route("**/api/enquire", async (route) => {
    posted = JSON.parse(route.request().postData() ?? "{}");
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"filed":true}' });
  });
  await page.goto("/#demo");
  const card = page.locator("#demo-card");
  const next = card.getByRole("button", { name: /Continue|Skip|Book my demo/ });
  await expect(next).toBeDisabled();
  await card.getByRole("checkbox", { name: "Replies go out late" }).click();
  await next.click();
  // One-choice steps move on by themselves.
  await card.getByRole("radio", { name: "50 to 200" }).click();
  await expect(card.getByText("Step 3 of 5")).toBeVisible();
  await card.getByRole("checkbox", { name: "Instagram" }).click();
  await next.click();
  // Back keeps the answer.
  await card.getByRole("button", { name: "Back" }).click();
  await expect(card.getByRole("checkbox", { name: "Instagram" })).toBeChecked();
  await next.click();
  await card.getByRole("radio", { name: "2–5" }).click();
  await expect(card.getByText("Step 5 of 5")).toBeVisible();
  await card.getByLabel("Your name").fill("Asha Verma");
  await card.getByLabel("Business").fill("Northlight Studio");
  await card.getByLabel("WhatsApp number").fill("98123 45678");
  await card.getByRole("button", { name: "Book my demo" }).click();
  await expect(card.getByRole("status")).toBeVisible();
  expect(posted).toMatchObject({
    name: "Asha Verma",
    business: "Northlight Studio",
    teamSize: "2-5",
    volume: "50-200",
    website: "",
  });
  expect(String(posted!["need"])).toContain("late");
  expect(String(posted!["how"])).toContain("Instagram");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every section reads in its finished state, and the FAQ opens", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your leads are going cold.");
    for (const h of [
      "Leads come in from everywhere. Replies go out when someone remembers.",
      "Now do the sum on your own leads.",
      "Your WhatsApp Business number, working inside LUME.",
      "Calls get booked inside LUME, on the times you give it.",
      "Asked before every demo.",
      "See LUME on your own leads.",
    ]) {
      const head = page.getByRole("heading", { name: h });
      await expect(head).toBeVisible();
      const faint = await head.evaluate((e) =>
        [e, ...e.querySelectorAll("*")].some((n) => Number(getComputedStyle(n).opacity) < 1),
      );
      expect(faint, `${h} is still waiting for a scroll`).toBe(false);
    }
    const first = page.locator("details summary").first();
    await first.click();
    await expect(page.locator("details[open]")).toHaveCount(1);
  });

  test("reduced motion: even the first paint (before the page's script runs) has nothing looping", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => a.playState === "running" && (a.effect?.getTiming().iterations ?? 1) === Infinity)
          .length,
    );
    expect(running).toBe(0);
  });

  test("the plain form posts and sends the visitor on to WhatsApp", async ({ page }) => {
    await page.goto("/#demo");
    await page.getByLabel("Your name").fill("Ananya Rao");
    await page.getByRole("textbox", { name: "Business" }).fill("Petal & Plate Studio");
    await page.getByRole("textbox", { name: /WhatsApp number/ }).fill("+91 98123 45678");
    let to = "";
    await page.route(/wa\.me|whatsapp\.com/, (r) => {
      to ||= r.request().url();
      return r.fulfill({ status: 200, body: "" });
    });
    await page.getByRole("button", { name: "Book my demo" }).click();
    // With no enquiry service configured in tests, the visitor is sent to WhatsApp with the details written.
    await expect
      .poll(() => to)
      .toMatch(/wa\.me\/919764256655\?text=|whatsapp\.com\/send\/\?phone=919764256655&text=/);
    expect(decodeURIComponent(to.replace(/\+/g, " "))).toContain("Petal & Plate Studio");
  });
});
