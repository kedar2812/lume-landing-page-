import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/screens", () => ({
  SCREENS: new Proxy({}, { get: () => ({ width: 2880, height: 1800, phone: false }) }),
  srcOf: (n: string, t: string) => `/screens/${n}-${t}.webp`,
}));
import { Faq } from "./Faq";
import { Footer } from "./Footer";

describe("the sections told in words (website spec §5)", () => {
  it("FAQ: the objections, answered in the page even without JavaScript", () => {
    render(<Faq />);
    const qs = screen.getAllByRole("group").length;
    expect(qs).toBe(4);
    expect(screen.getByText("Do I need the WhatsApp Business API?")).toBeInTheDocument();
    expect(screen.getByText(/LUME opens your own WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText("What happens when a salesperson leaves?")).toBeInTheDocument();
  });

  it("the footer names the founder and carries the Google statement and the documents", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 LUME · Kedar Uttam Gurav/)).toBeInTheDocument();
    expect(screen.getByText(/including the Limited Use requirements/)).toBeInTheDocument();
    // Google's reviewers read the homepage for why LUME asks for Sheets and Calendar access.
    expect(screen.getByText(/Google Sheets you pick/)).toBeInTheDocument();
    expect(screen.getByText(/calendars you own, read-only/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
