import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/screens", () => ({
  SCREENS: new Proxy({}, { get: () => ({ width: 2880, height: 1800, phone: false }) }),
  srcOf: (n: string, t: string) => `/screens/${n}-${t}.webp`,
}));
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { LeadsDay } from "./LeadsDay";
import { OwnServer } from "./OwnServer";
import { Sources } from "./Sources";

describe("the sections told in words (website spec §5)", () => {
  it("answer 01: every lead in one list, from where they already come; official logos only where LUME ships them", () => {
    render(<Sources />);
    expect(screen.getByRole("heading", { name: "Every lead in one list." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Solves 01/ })).toHaveAttribute("href", "#problem-01");
    const list = screen.getByRole("list", { name: "Lead sources" });
    expect(
      within(list)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "Instagram & Facebook forms",
      "Your website",
      "Google Sheets",
      "Calendly",
      "Zapier & Make",
      "A spreadsheet you already have",
    ]);
    expect(screen.queryByText(/IndiaMART|JustDial/)).not.toBeInTheDocument();
  });

  it("a lead's day: four steps, in order", () => {
    render(<LeadsDay />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "A form is filled",
      "The right person knows",
      "WhatsApp in one tap",
      "The call, then won",
    ]);
  });

  it("your own LUME: the measured numbers, final under reduced motion", () => {
    render(<OwnServer />);
    for (const n of ["1,000,000", "8 ms", "50,000"]) expect(screen.getByText(n)).toBeInTheDocument();
  });

  it("FAQ: the objections, answered in the page even without JavaScript", () => {
    render(<Faq />);
    const qs = screen.getAllByRole("group").length;
    expect(qs).toBe(7);
    expect(screen.getByText("Do I need the WhatsApp Business API?")).toBeInTheDocument();
    expect(screen.getByText(/LUME opens your own WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText("Can I see how each rep is doing?")).toBeInTheDocument();
  });

  it("the footer names the founder and carries the Google statement and the documents", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 LUME · Kedar Uttam Gurav/)).toBeInTheDocument();
    expect(screen.getByText(/including the Limited Use requirements/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
