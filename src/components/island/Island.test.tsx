import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Island, CHAPTERS } from "./Island";
import { islandState, sectionLabel } from "./state";

const phone = (on: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (q: string) =>
      ({
        matches: on && q.includes("max-width"),
        media: q,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        onchange: null,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
afterEach(() => vi.restoreAllMocks());

describe("the Island's state (website spec §5.H)", () => {
  const at = (o: Partial<Parameters<typeof islandState>[0]>) =>
    islandState({ y: 0, heroBuilding: false, notifying: false, phone: false, open: false, ...o });
  it("wide at the very top; compact once the hero starts building or the page has moved on", () => {
    expect(at({})).toBe("wide");
    expect(at({ heroBuilding: true })).toBe("compact");
    expect(at({ y: 900 })).toBe("compact");
  });
  it("hovering or focusing it opens it wide again; a notification wins briefly", () => {
    expect(at({ y: 900, open: true })).toBe("wide");
    expect(at({ y: 900, notifying: true })).toBe("notify");
  });
  it("a phone always docks it at the bottom", () => {
    expect(at({ phone: true, notifying: true })).toBe("dock");
  });
  it("names the chapter being read", () => {
    expect(sectionLabel("problem")).toBe("The problem");
    expect(sectionLabel("analytics")).toBe("Analytics");
    expect(sectionLabel("team")).toBe("Your team");
    expect(sectionLabel("phone")).toBe("On your phone");
    expect(sectionLabel("faq")).toBe("Questions");
    expect(sectionLabel(null)).toBe("LUME");
  });
});

describe("the Island", () => {
  const show = () =>
    render(
      <ThemeProvider>
        <Island whatsapp="918805895066" />
      </ThemeProvider>,
    );

  it("wide: the chapters, the theme switch, WhatsApp and Book a demo — no underlines, real links", () => {
    phone(false);
    show();
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const c of CHAPTERS.slice(0, 4))
      expect(within(nav).getAllByRole("link", { name: c.label })[0]).toHaveAttribute("href", `#${c.id}`);
    expect(within(nav).getAllByRole("radio", { name: "Dark" })[0]).toBeInTheDocument();
    expect(within(nav).getAllByRole("link", { name: /Book a demo/ })[0]).toHaveAttribute("href", "#enquire");
    expect(within(nav).getAllByRole("link", { name: /WhatsApp/ })[0]).toHaveAttribute(
      "href",
      "https://wa.me/918805895066",
    );
  });

  it("the hero's new-lead moment shows once, then the Island settles back", async () => {
    vi.useFakeTimers();
    phone(false);
    show();
    act(
      () =>
        void window.dispatchEvent(
          new CustomEvent("lume:notify", { detail: { text: "New lead · Instagram · just now" } }),
        ),
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toHaveAttribute("data-state", "notify");
    act(() => void vi.advanceTimersByTime(2600));
    expect(screen.getByRole("navigation", { name: "Main" })).not.toHaveAttribute("data-state", "notify");
    vi.useRealTimers();
  });

  it("on a phone the dock opens a sheet with the chapters, the theme and WhatsApp; Esc returns focus", async () => {
    phone(true);
    show();
    const dock = screen.getByRole("button", { name: /Menu/ });
    await userEvent.click(dock);
    const sheet = screen.getByRole("dialog", { name: "Menu" });
    expect(
      within(sheet)
        .getAllByRole("link")
        .map((a) => a.textContent),
    ).toEqual(expect.arrayContaining(["The problem", "What LUME does", "Questions"]));
    expect(within(sheet).getByRole("radio", { name: "Dark" })).toBeInTheDocument();
    expect(within(sheet).getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/918805895066",
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    expect(dock).toHaveFocus();
  });

  it("on a phone the dock waits below the screen while the hero's own buttons show, then rises in", () => {
    phone(true);
    show();
    const nav = screen.getByRole("navigation", { name: "Main", hidden: true });
    expect(nav).toHaveAttribute("data-hidden");
    act(() => void window.dispatchEvent(new CustomEvent("lume:hero", { detail: { p: 0.4 } })));
    expect(nav).not.toHaveAttribute("data-hidden");
    expect(within(nav).getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", "#enquire");
  });
});
