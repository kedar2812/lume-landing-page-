import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Enquire } from "./Enquire";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const fill = async () => {
  await userEvent.type(screen.getByLabelText("Your name"), "Ananya Rao");
  await userEvent.type(screen.getByLabelText("Business"), "Petal & Plate Studio");
  await userEvent.type(screen.getByLabelText("WhatsApp number"), "98123 45678");
  await userEvent.click(screen.getByRole("radio", { name: "2–5" }));
};

describe("the enquiry (website spec §5, item 15)", () => {
  it("five fields and one optional line, and it posts as a plain form without JavaScript", () => {
    render(<Enquire whatsapp="918805895066" />);
    const form = screen.getByRole("form", { name: "Book a demo" });
    expect(form).toHaveAttribute("action", "/api/enquire");
    expect(form).toHaveAttribute("method", "post");
    for (const l of [
      "Your name",
      "Business",
      "WhatsApp number",
      "Email (optional)",
      "How do leads reach you today? (optional)",
    ])
      expect(screen.getByLabelText(l)).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Team size" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\+91 88058 95066/ })).toHaveAttribute(
      "href",
      "https://wa.me/918805895066",
    );
  });
  it("says what's missing in words beside the field, before sending", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    render(<Enquire whatsapp="918805895066" />);
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    expect(screen.getByLabelText("Your name")).toHaveAccessibleDescription("Type your name.");
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-invalid", "true");
    expect(f).not.toHaveBeenCalled();
  });
  it("sent: the form becomes LUME's promise", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ ok: true, filed: true, emailed: true })),
    );
    vi.spyOn(Date, "now").mockReturnValueOnce(0).mockReturnValue(10_000);
    render(<Enquire whatsapp="918805895066" />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "LUME’s founder will message you on WhatsApp soon.",
    );
  });
  it("both ways down: WhatsApp opens with the details", async () => {
    const wa = "https://wa.me/918805895066?text=Hi";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ ok: false, whatsapp: wa }, { status: 502 })),
    );
    const go = vi.fn();
    render(<Enquire whatsapp="918805895066" go={go} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    await vi.waitFor(() => expect(go).toHaveBeenCalledWith(wa));
  });
});
