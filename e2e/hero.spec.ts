import { expect, test } from "@playwright/test";

/** The hero as approved (website spec §5.H): built by the scroll, the buttons into the Island, the other theme. */
test.describe("the hero", () => {
  test("at rest: the headline and both buttons, nothing of the dashboard; the Island wide", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Every lead, answered while it’s still warm.",
    );
    await expect(page.locator("main").getByRole("link", { name: "Book a demo" }).first()).toBeVisible();
    await expect(page.getByText("Scroll to bring LUME together")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toHaveAttribute("data-state", "wide");
  });

  test("scrolling builds Today, the Island goes compact, and it all comes apart again going back", async ({
    page,
  }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 1600);
    await expect(page.getByRole("navigation", { name: "Main" })).not.toHaveAttribute("data-state", "wide");
    await page.mouse.wheel(0, -1600);
    await expect(page.getByRole("navigation", { name: "Main" })).toHaveAttribute("data-state", "wide", {
      timeout: 5000,
    });
  });

  for (const theme of ["dark", "light"] as const)
    test(`review shots, ${theme}`, async ({ page }, info) => {
      test.skip(info.project.name !== "chromium");
      await page.addInitScript((t) => localStorage.setItem("lume-site-theme", t), theme);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(600);
      const H = await page.evaluate(
        () => document.querySelector("#top > div")!.getBoundingClientRect().height - innerHeight,
      );
      for (const [i, frac] of [0, 0.18, 0.4, 0.62, 1].entries()) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * frac));
        await page.waitForTimeout(900);
        await page.screenshot({ path: `e2e/__review__/hero-${theme}-${i}.png` });
      }
    });

  test("review shot, phone", async ({ page }, info) => {
    test.skip(info.project.name !== "chromium");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("lume-site-theme", "dark"));
    await page.goto("/");
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/__review__/hero-phone-0.png" });
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(900);
    await page.screenshot({ path: "e2e/__review__/hero-phone-1.png" });
  });
});
