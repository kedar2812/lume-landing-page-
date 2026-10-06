import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false });

/** Without JavaScript (website spec §8): every section reads, the FAQ opens, and the form still posts. */
test("the page reads in full, and the FAQ opens", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Every lead, answered while it’s still warm.",
  );
  for (const h of [
    "Sound familiar?",
    "Every lead in one list.",
    "What people ask first.",
    "See LUME on your own leads.",
  ])
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
  await page.getByText("Do I need the WhatsApp Business API?").click();
  await expect(page.getByText(/LUME opens your own WhatsApp/)).toBeVisible();
});

test("the form posts as a plain form and comes back", async ({ page }) => {
  await page.goto("/#enquire");
  await page.getByLabel("Your name").fill("Ananya Rao");
  await page.getByRole("textbox", { name: "Business" }).fill("Petal & Plate Studio");
  await page.getByLabel("WhatsApp number").fill("98123 45678");
  await page.getByRole("radio", { name: "2–5" }).check({ force: true });
  // Never leave for WhatsApp's real site from a test: catch where the form sends the visitor.
  let to = "";
  await page.route(/wa\.me|whatsapp\.com/, (r) => {
    to ||= r.request().url();
    return r.fulfill({ status: 200, body: "" });
  });
  await page.getByRole("button", { name: "Book my demo" }).click();
  // With no enquiry service configured in tests, both ways fail: the visitor is sent to WhatsApp, details written.
  // (Chromium follows wa.me's own redirect before a route can answer it, so either address counts.)
  await expect
    .poll(() => to)
    .toMatch(/wa\.me\/918805895066\?text=|whatsapp\.com\/send\/\?phone=918805895066&text=/);
  expect(decodeURIComponent(to.replace(/\+/g, " "))).toContain("Petal & Plate Studio");
});
