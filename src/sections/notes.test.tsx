import { render, screen, within } from "@testing-library/react";
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

import { Forgotten } from "./Forgotten";
import { NOTES, Notes } from "./Notes";
import { Phone } from "./Phone";

describe("the page in a few screens (owner's redesign, 2026-10-06)", () => {
  it("the problem in one line, three facts, the study cited", () => {
    render(<Forgotten />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Most leads aren’t lost. They’re forgotten.",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(/Oldroyd/)).toBeInTheDocument();
  });

  it("five notes, each one plain sentence over LUME's own screen, with a few words beside it", () => {
    render(<Notes />);
    expect(NOTES).toHaveLength(5);
    for (const n of NOTES) {
      const sec = screen.getByRole("region", { name: n.title });
      expect(within(sec).getByRole("img")).toHaveAccessibleName(n.alt);
      expect(within(sec).getAllByRole("listitem").length).toBeGreaterThanOrEqual(3);
    }
    expect(
      screen.getByRole("region", { name: "Analytics that read like a colleague’s note." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Every rep gets their own scoreboard." })).toBeInTheDocument();
  });

  it("the phone: three of LUME's phone screens", () => {
    render(<Phone />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });
});
