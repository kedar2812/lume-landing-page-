/**
 * The visitor's sum, and nothing more: of `leads` a month, `sameDay` in a hundred get a reply the day they write;
 * of the rest, one in `oneIn` would have bought, each worth `worth`. Whole leads and whole customers, rounded down
 * so the page never claims a customer the numbers don't give.
 */
export function leak({
  leads,
  sameDay,
  oneIn,
  worth,
}: {
  leads: number;
  sameDay: number;
  oneIn: number;
  worth: number;
}) {
  const clamp = (n: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));
  const waiting = Math.round(clamp(leads, 0, 1e7) * (1 - clamp(sameDay, 0, 100) / 100));
  const customers = Math.floor(waiting / clamp(oneIn, 1, 1e6));
  const month = customers * clamp(worth, 0, 1e9);
  return { waiting, customers, month, year: month * 12 };
}
