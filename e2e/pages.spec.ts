import { expect, test } from "@playwright/test";

/** What Google checked stays exactly where it was (website spec §9). */
const LIMITED_USE =
  "LUME's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.";

test("the privacy policy keeps Google's wording and the scopes LUME asks for", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
  const text = (await page.locator("main").innerText()).replace(/\s+/g, " ").replace(/’/g, "'");
  expect(text).toContain(LIMITED_USE);
  for (const scope of ["drive.file", "calendar.events.owned.readonly", "calendar.calendarlist.readonly"])
    expect(text).toContain(scope);
});

test("the terms are there, and the homepage links both and carries the Limited Use statement", async ({
  page,
}) => {
  await page.goto("/terms");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terms of service");
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Privacy" }).first()).toHaveAttribute("href", "/privacy");
  await expect(page.getByRole("link", { name: "Terms" }).first()).toHaveAttribute("href", "/terms");
  await expect(page.getByText(/including the Limited Use requirements/).first()).toBeVisible();
});
