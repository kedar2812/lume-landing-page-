// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NEEDS, enquirySchema } from "@/lib/enquiry";
import { BEATS, clockAt, minutesAt, stageAt } from "./cold-script";
import { EMPTY, QUESTIONS, STEPS, checkYou, choose, fullNumber, payload, ready, type Answers } from "./flow";
import { leak } from "./leak";
import { LAST, STEPS as SCENE, nextStep } from "./stage-script";
import { heat, waited } from "./waiting";

const FULL: Answers = {
  need: [NEEDS[0], NEEDS[1]],
  volume: "50-200",
  how: ["Instagram", "Website"],
  teamSize: "2-5",
  name: "  Asha Verma ",
  business: "Northlight Studio",
  country: "IN",
  whatsapp: "98123 45678",
  email: "",
};

describe("book a demo, in five steps", () => {
  it("asks four tapped questions, then who to reply to", () => {
    expect([...STEPS]).toEqual(["need", "volume", "how", "teamSize", "you"]);
    for (const s of STEPS) if (s !== "you") expect(QUESTIONS[s].choices.length).toBeGreaterThanOrEqual(4);
  });
  it("won't move on from a question nobody answered, except where they come from", () => {
    expect(ready("need", EMPTY)).toBe(false);
    expect(ready("volume", EMPTY)).toBe(false);
    expect(ready("teamSize", EMPTY)).toBe(false);
    expect(ready("how", EMPTY)).toBe(true);
    expect(ready("you", EMPTY)).toBe(false);
    for (const s of STEPS) expect(ready(s, FULL)).toBe(true);
  });
  it("a tap chooses; where many fit a second tap takes it back; where one fits it replaces", () => {
    let a = choose("need", EMPTY, NEEDS[0]);
    a = choose("need", a, NEEDS[2]);
    expect(a.need).toEqual([NEEDS[0], NEEDS[2]]);
    expect(choose("need", a, NEEDS[0]).need).toEqual([NEEDS[2]]);
    expect(choose("volume", choose("volume", EMPTY, "<50"), "1000+").volume).toBe("1000+");
    expect(ready("volume", { ...EMPTY, volume: "lots" })).toBe(false);
  });
  it("checks the last step in the server's words", () => {
    expect(checkYou(EMPTY)).toEqual({
      name: "Type your name.",
      business: "Type your business’s name.",
      whatsapp: "Type your WhatsApp number.",
    });
    expect(checkYou({ ...FULL, email: "asha@" })).toEqual({ email: "That email doesn’t look right." });
    expect(checkYou({ ...FULL, whatsapp: "12" }).whatsapp).toBeDefined();
    expect(checkYou({ ...FULL, country: "GB", whatsapp: "07700 900123" })).toEqual({});
    expect(checkYou({ ...FULL, name: "x".repeat(121) }).name).toBe("That name is too long.");
    expect(fullNumber(FULL)).toBe("+919812345678");
  });
  it("sends what the server's schema takes, the new answers among it", () => {
    const p = enquirySchema.safeParse(payload(FULL, 9000));
    expect(p.success).toBe(true);
    expect(p.data).toEqual({
      name: "Asha Verma",
      business: "Northlight Studio",
      teamSize: "2-5",
      how: "Instagram, Website",
      need: "Replies go out late, Follow-ups get forgotten",
      volume: "50-200",
      whatsapp: "+919812345678",
      email: undefined,
    });
  });
  it("every choice together still fits what the dashboard stores", () => {
    const all = payload({ ...FULL, need: [...NEEDS], how: QUESTIONS.how.choices.map((c) => c.id) }, 9000);
    expect(String(all.need).length).toBeLessThanOrEqual(300);
    expect(String(all.how).length).toBeLessThanOrEqual(500);
    expect(enquirySchema.safeParse(all).success).toBe(true);
  });
});

describe("the hero", () => {
  it("the scene plays every step and starts again, the call never before its conversation", () => {
    expect(nextStep(0)).toBe(1);
    expect(nextStep(LAST)).toBe(0);
    for (const s of SCENE) if (s.booked) expect(s.lines).toBe(4);
    expect(SCENE[LAST]!.booked).toBe(true);
  });
  it("says how long a lead has waited as a person would, and how warm they still are", () => {
    expect(waited(0.5)).toBe("just now");
    expect(waited(14)).toBe("14 min");
    expect(waited(96)).toBe("1 h 36 min");
    expect(waited(560)).toBe("9 h");
    expect(waited(1500)).toBe("1 day");
    expect(waited(7300)).toBe("5 days");
    expect([heat(0), heat(29), heat(30), heat(479), heat(480)]).toEqual([
      "warm",
      "warm",
      "cooling",
      "cooling",
      "cold",
    ]);
  });
});

describe("one lead's day, by the scroll", () => {
  it("starts at 10:02 on Tuesday and ends at 11:40 on Wednesday, never running backwards", () => {
    expect(clockAt(minutesAt(0))).toEqual({ day: "Tuesday", time: "10:02", half: "am" });
    expect(clockAt(minutesAt(1))).toEqual({ day: "Wednesday", time: "11:40", half: "am" });
    let last = -1;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      expect(minutesAt(p)).toBeGreaterThanOrEqual(last);
      last = minutesAt(p);
    }
  });
  it("each beat lands on the time its message shows", () => {
    const at = (i: number) => clockAt(minutesAt(BEATS[i]!.at));
    expect(at(1)).toMatchObject({ time: "10:40", half: "am" });
    expect(at(2)).toMatchObject({ time: "1:15", half: "pm" });
    expect(at(3)).toMatchObject({ time: "6:50", half: "pm" });
    expect(stageAt(0.5)).toBe(2);
    expect(stageAt(-1)).toBe(0);
    expect(stageAt(2)).toBe(4);
    expect(clockAt(118)).toMatchObject({ time: "12:00", half: "pm" });
  });
});

describe("the visitor's own sum", () => {
  it("counts the leads left waiting, whole customers only, and the year", () => {
    expect(leak({ leads: 300, sameDay: 60, oneIn: 10, worth: 25000 })).toEqual({
      waiting: 120,
      customers: 12,
      month: 300000,
      year: 3600000,
    });
    expect(leak({ leads: 25, sameDay: 80, oneIn: 10, worth: 5000 })).toMatchObject({
      waiting: 5,
      customers: 0,
      month: 0,
    });
  });
  it("is nothing when everyone is answered, and never negative or NaN on odd numbers", () => {
    expect(leak({ leads: 500, sameDay: 100, oneIn: 5, worth: 1000 }).waiting).toBe(0);
    for (const v of Object.values(leak({ leads: -5, sameDay: 140, oneIn: 0, worth: NaN }))) {
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});
