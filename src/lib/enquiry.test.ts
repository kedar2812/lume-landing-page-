import { describe, expect, it } from "vitest";
import { enquirySchema, normaliseWhatsapp, whatsappLink } from "./enquiry";

describe("an enquiry's WhatsApp number, as people type them", () => {
  it("reads Indian numbers with or without the country code, spaces and dashes", () => {
    expect(normaliseWhatsapp("98123 45678")).toBe("+919812345678");
    expect(normaliseWhatsapp("+91 98123-45678")).toBe("+919812345678");
    expect(normaliseWhatsapp("0091 9812345678")).toBe("+919812345678");
    expect(normaliseWhatsapp("09812345678")).toBe("+919812345678");
    expect(normaliseWhatsapp("+44 7700 900123")).toBe("+447700900123");
  });
  it("refuses what can't be a number", () => {
    expect(normaliseWhatsapp("12345")).toBeNull();
    expect(normaliseWhatsapp("call me")).toBeNull();
    expect(normaliseWhatsapp("")).toBeNull();
  });
});

describe("the enquiry", () => {
  const ok = {
    name: "Ananya Rao",
    business: "Petal & Plate Studio",
    whatsapp: "98123 45678",
    teamSize: "2-5",
  };
  it("needs a name, a business, a WhatsApp number and a team size; email and how are optional", () => {
    const r = enquirySchema.safeParse(ok);
    expect(r.success && r.data.whatsapp).toBe("+919812345678");
    expect(enquirySchema.safeParse({ ...ok, name: " " }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, email: "not-an-email" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, email: "" }).success).toBe(true);
    expect(enquirySchema.safeParse({ ...ok, teamSize: "lots" }).success).toBe(false);
  });
  it("puts the chosen country's code in front of the number, so it arrives in full", () => {
    const uk = enquirySchema.safeParse({ ...ok, country: "GB", whatsapp: "07700 900123" });
    expect(uk.success && uk.data.whatsapp).toBe("+447700900123");
    const uae = enquirySchema.safeParse({ ...ok, country: "AE", whatsapp: "50 123 4567" });
    expect(uae.success && uae.data.whatsapp).toBe("+971501234567");
    // Typed with its own + code: kept as typed, whatever the picker says.
    const typed = enquirySchema.safeParse({ ...ok, country: "GB", whatsapp: "+91 98123 45678" });
    expect(typed.success && typed.data.whatsapp).toBe("+919812345678");
    // The licence server takes no country field: it's folded into the number.
    expect(uk.success && "country" in uk.data).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, country: "ZZ" }).success).toBe(false);
  });
  it("says what's wrong in words, beside the field", () => {
    const r = enquirySchema.safeParse({ ...ok, whatsapp: "123" });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(r.error.issues[0]).toMatchObject({
        path: ["whatsapp"],
        message: "Type your WhatsApp number.",
      });
  });
  it("WhatsApp to LUME, with the details already written", () => {
    const link = whatsappLink(
      { name: "Ananya Rao", business: "Petal & Plate Studio", whatsapp: "+919812345678", teamSize: "2-5" },
      "918805895066",
    );
    expect(link.startsWith("https://wa.me/918805895066?text=")).toBe(true);
    const text = decodeURIComponent(link.split("text=")[1]!);
    expect(text).toContain("Ananya Rao");
    expect(text).toContain("Petal & Plate Studio");
    expect(text).toContain("2–5");
  });
});
