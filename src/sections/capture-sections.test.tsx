import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/screens", () => {
  const DESK = { width: 2880, height: 1800, phone: false };
  const PHONE = { width: 1170, height: 2532, phone: true };
  const SCREENS = new Proxy({} as Record<string, typeof DESK>, {
    get: (_, k: string) => (k.endsWith("-phone") ? PHONE : DESK),
  });
  return {
    SCREENS,
    srcOf: (n: string, t: string, p?: boolean) =>
      `/screens/${n.replace(/-phone$/, "")}-${t}${p ? "-phone" : ""}.webp`,
  };
});
import { Actions, ACTIONS } from "./Actions";
import { Analytics } from "./Analytics";
import { CaughtEarly } from "./CaughtEarly";
import { FollowUp } from "./FollowUp";
import { Phone } from "./Phone";
import { RepDashboards } from "./RepDashboards";
import { Security } from "./Security";

const shown = () =>
  [...document.querySelectorAll<HTMLImageElement>("img[data-theme-img='light']")].map((i) =>
    i.getAttribute("src"),
  );

describe("the sections built on LUME's own screens (website spec §5)", () => {
  it("follow-up: nobody waits, WhatsApp ready to send", () => {
    render(<FollowUp />);
    expect(screen.getByRole("heading", { name: "Nobody waits. Nothing slips." })).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp · ready to send/)).toBeInTheDocument();
    expect(shown()).toContain("/screens/today-light.webp");
  });

  it("actions: nine real things, each with its key and its capture; a click shows that moment", async () => {
    render(<Actions />);
    expect(ACTIONS).toHaveLength(9);
    const list = screen.getByRole("tablist", { name: "What your team does in LUME" });
    expect(within(list).getAllByRole("tab")).toHaveLength(9);
    await userEvent.click(screen.getByRole("tab", { name: /Win a deal/ }));
    expect(screen.getByRole("tab", { name: /Win a deal/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByAltText(/won/i));
  });

  it("actions: arrow keys move between them, one Tab stop", async () => {
    render(<Actions />);
    await userEvent.click(screen.getAllByRole("tab")[0]!);
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("tab")[1]).toHaveFocus();
    expect(screen.getAllByRole("tab").filter((t) => t.tabIndex === 0)).toHaveLength(1);
  });

  it("the phone: three of LUME's phone screens", () => {
    render(<Phone />);
    expect(
      screen.getByRole("heading", { name: "Your reps carry LUME in their pocket." }),
    ).toBeInTheDocument();
    expect(shown()).toEqual([
      "/screens/today-light-phone.webp",
      "/screens/leads-light-phone.webp",
      "/screens/drawer-light-phone.webp",
    ]);
  });

  it("every rep's own dashboard, and the owner's Team board", () => {
    render(<RepDashboards />);
    expect(
      screen.getByRole("heading", { name: "Each rep sees their own day and numbers. You see everyone’s." }),
    ).toBeInTheDocument();
    expect(shown()).toEqual([
      "/screens/today-rep-light.webp",
      "/screens/me-light.webp",
      "/screens/team-light.webp",
    ]);
  });

  it("caught early: four warnings, each beside what happens next", () => {
    render(<CaughtEarly />);
    expect(
      screen.getByRole("heading", { name: "LUME spots trouble before it costs you." }),
    ).toBeInTheDocument();
    const pairs = screen.getAllByRole("listitem");
    expect(pairs).toHaveLength(4);
    for (const p of pairs) {
      expect(within(p).getByText(/^LUME spotted/)).toBeInTheDocument();
      expect(within(p).getByText(/^Then/)).toBeInTheDocument();
    }
  });

  it("analytics: C's section — the line, the four notes, from the demo business", () => {
    render(<Analytics />);
    expect(
      screen.getByRole("heading", { name: "Analytics that read like a colleague’s note." }),
    ).toBeInTheDocument();
    for (const t of [
      "Speed pays off",
      "Referrals punch above their weight",
      "Webinars cost more than they return",
      "Most leads arrive after 7 pm",
    ])
      expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.getByText("From the demo business")).toBeInTheDocument();
  });

  it("when someone leaves, the leads don't: five protections", () => {
    render(<Security />);
    expect(
      screen.getByRole("heading", { name: "When someone leaves, your leads don’t." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });
});
