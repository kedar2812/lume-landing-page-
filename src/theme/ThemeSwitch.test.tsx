import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeSwitch } from "./ThemeSwitch";
import { THEME_KEY } from "./theme-script";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});
const show = () =>
  render(
    <ThemeProvider>
      <ThemeSwitch />
    </ThemeProvider>,
  );

describe("Auto · Light · Dark, LUME's own switch", () => {
  it("offers LUME's three words as one radio group", () => {
    show();
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio").map((r) => r.getAttribute("aria-label") ?? r.textContent)).toEqual([
      "Auto",
      "Light",
      "Dark",
    ]);
  });
  it("the choice is remembered and the whole page follows", async () => {
    show();
    await userEvent.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "Auto" }));
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    expect(document.documentElement.dataset.theme).toBe("light"); // the test's system is light
  });
  it("still switches with storage blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    show();
    await userEvent.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
  it("arrow keys move the choice, one Tab stop", async () => {
    show();
    await userEvent.click(screen.getByRole("radio", { name: "Auto" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Light" })).toHaveFocus();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getAllByRole("radio").filter((r) => r.tabIndex === 0)).toHaveLength(1);
  });
});
