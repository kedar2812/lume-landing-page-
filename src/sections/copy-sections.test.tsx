import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { LeadsDay } from "./LeadsDay";
import { OwnServer } from "./OwnServer";
import { Problem } from "./Problem";
import { Sources } from "./Sources";

describe("the sections told in words (website spec §5)", () => {
  it("sources: where leads already come from, official logos only where LUME ships them", () => {
    render(<Sources />);
    expect(
      screen.getByRole("heading", { name: "Leads arrive from where you already are" }),
    ).toBeInTheDocument();
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

  it("the problem: three lines, then the one study, with its source", () => {
    render(<Problem />);
    expect(screen.getByText("Your leads are in five places.")).toBeInTheDocument();
    expect(screen.getByText("The first reply comes days later.")).toBeInTheDocument();
    expect(
      screen.getByText(/when your best salesperson leaves, the leads go with their phone/),
    ).toBeInTheDocument();
    expect(screen.getByText("21×")).toBeInTheDocument();
    expect(
      screen.getByText(/Oldroyd, Lead Response Management Study, MIT and InsideSales, 2007/),
    ).toBeInTheDocument();
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
