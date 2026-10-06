/* eslint-disable @next/next/no-img-element -- the LUME mark inside the rebuilt app */
import type { CSSProperties } from "react";
import { along } from "@/motion/build";
import { Ico } from "./icons";
import l from "./lume.module.css";
import s from "./analytics.module.css";

/**
 * LUME's Analytics overview rebuilt in HTML, from the demo business's last 30 days (the site's capture, the same
 * numbers). Every part takes `t` (0 → 1, how far it's built): tiles count up and draw their lines, the chart sweeps
 * in, the funnel's bars grow, LUME's notes arrive. t = 1 is the finished screen.
 */

/** A smooth line through points (Catmull–Rom as cubic Béziers), in a w × h box. */
function smooth(ys: number[], w: number, h: number, pad = 2): string {
  const max = Math.max(...ys);
  const min = Math.min(...ys);
  const pts = ys.map((y, i) => [
    (i / (ys.length - 1)) * w,
    pad + (h - 2 * pad) * (1 - (y - min) / (max - min || 1)),
  ]);
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1] ?? pts[i]!;
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[i + 1]!;
    const [x3, y3] = pts[i + 2] ?? pts[i + 1]!;
    const c1 = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6];
    const c2 = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6];
    d += ` C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}
/** A steady, believable wiggle, the same on every render (no randomness: server and browser agree). */
const series = (seed: number, n: number, rise: number) =>
  Array.from(
    { length: n },
    (_, i) => 10 + rise * (i / n) + 3 * Math.sin(i * 0.9 + seed) + 2 * Math.sin(i * 2.3 + seed * 2),
  );

export type TileData = {
  name: string;
  to: number;
  fmt: (v: number) => string;
  unit?: string;
  delta?: string;
  down?: boolean;
  note?: string;
  kind?: "money" | "alert" | "plain";
  seed: number;
};
const n0 = (v: number) => Math.round(v).toLocaleString("en-IN");
export const TILES: TileData[] = [
  { name: "New leads", to: 644, fmt: n0, delta: "+23.6%", seed: 1 },
  { name: "Contacted", to: 92, fmt: (v) => `${Math.round(v)}%`, delta: "+7.3 pts", seed: 2 },
  { name: "Reply rate", to: 59, fmt: (v) => `${Math.round(v)}%`, delta: "+14.7 pts", seed: 3 },
  { name: "Calls booked", to: 157, fmt: n0, delta: "+38.9%", seed: 4 },
  { name: "Calls held", to: 131, fmt: n0, delta: "+36.5%", seed: 5 },
  {
    name: "Revenue won",
    to: 50.7,
    fmt: (v) => `₹${v.toFixed(1)}L`,
    delta: "+197.3%",
    kind: "money",
    seed: 6,
  },
  { name: "Won", to: 95, fmt: n0, delta: "+143.6%", seed: 7 },
  { name: "Win rate", to: 8.5, fmt: (v) => `${v.toFixed(1)}%`, delta: "+0.1 pts", seed: 8 },
  { name: "Average deal", to: 53.4, fmt: (v) => `₹${v.toFixed(1)}K`, delta: "+22.0%", seed: 9 },
  {
    name: "Speed to lead",
    to: 33,
    fmt: n0,
    unit: "min",
    delta: "−36.5%",
    down: true,
    note: "53 not contacted yet",
    seed: 10,
  },
  { name: "Follow-ups overdue", to: 16, fmt: n0, note: "Right now", kind: "alert", seed: 11 },
  {
    name: "Pipeline forecast",
    to: 1.1,
    fmt: (v) => `₹${v.toFixed(1)}Cr`,
    note: "Right now",
    kind: "plain",
    seed: 12,
  },
];

/** One KPI tile: the number counts up as it lands, then its line draws. */
export function Tile({ d, t, style }: { d: TileData; t: number; style?: CSSProperties }) {
  const count = along(t, 0.1, 0.6);
  const draw = along(t, 0.35, 0.65);
  const line =
    d.kind === "alert" || d.kind === "plain" ? null : smooth(series(d.seed, 18, d.down ? -6 : 8), 104, 44);
  return (
    <div className={s.tile} data-kind={d.kind} style={style}>
      <p className={s.name}>{d.name}</p>
      <p className={s.value}>
        {d.fmt(d.to * count)}
        {d.unit && <span> {d.unit}</span>}
      </p>
      {d.delta && (
        <span className={d.kind === "money" ? s.deltaMoney : l.up}>
          {d.down ? Ico.trendDown : Ico.trendUp} {d.delta}
        </span>
      )}
      {d.note && <span className={d.kind ? s.right : s.small}>{d.note}</span>}
      {line && (
        <svg className={s.spark} viewBox="0 0 104 44" preserveAspectRatio="none" aria-hidden="true">
          <path d={`${line} L104 44 L0 44 Z`} className={s.area} style={{ opacity: draw }} />
          <path d={line} pathLength={1} className={s.stroke} style={{ strokeDashoffset: 1 - draw }} />
        </svg>
      )}
    </div>
  );
}

export function Header({ t }: { t: number }) {
  return (
    <div className={s.header} style={{ opacity: t, transform: `translateY(${-14 * (1 - t)}px)` }}>
      <div className={s.bar}>
        <span className={s.tabs}>
          {["Overview", "Funnel", "Team", "Revenue & sources", "Lost", "Timing", "Templates & data"].map(
            (x, i) => (
              <span key={x} data-on={i === 0 || undefined}>
                {x}
              </span>
            ),
          )}
        </span>
        <span className={s.ctl}>{Ico.refresh}</span>
        <span className={s.ctl}>
          {Ico.calendar} Last 30 days {Ico.chevron}
        </span>
        <span className={s.ctl}>
          {Ico.filter} Filters <i>0</i>
        </span>
        <span className={s.ctl}>{Ico.download}</span>
      </div>
      <p className={s.title}>A good month. Revenue is up.</p>
      <p>
        644 new leads and 95 won.
        <em>
          <i /> Counted every 10 minutes
        </em>
      </p>
    </div>
  );
}

const DAYS = 30;
const LAYERS = [
  { name: "Instagram ads", color: "#7d9bff", seed: 1, base: 9 },
  { name: "Website form", color: "#8ccbff", seed: 2, base: 6 },
  { name: "Webinars", color: "#46c98a", seed: 3, base: 4 },
  { name: "Referrals", color: "#f6c35a", seed: 4, base: 3 },
  { name: "2 more sources", color: "#a8adb8", seed: 5, base: 2 },
];
/** New leads by source: stacked areas sweeping in from the left. */
export function Sources({ t }: { t: number }) {
  const W = 610;
  const H = 230;
  const sweep = along(t, 0.25, 0.75);
  const vals = LAYERS.map((ly) =>
    Array.from({ length: DAYS }, (_, i) =>
      Math.max(
        1,
        ly.base +
          0.08 * i * ly.base * 0.3 +
          2.4 * Math.sin(i * 0.8 + ly.seed) +
          1.2 * Math.sin(i * 2.1 + ly.seed),
      ),
    ),
  );
  const tops: number[][] = [];
  vals.forEach((v, k) => tops.push(v.map((y, i) => y + (k ? tops[k - 1]![i]! : 0))));
  const max = Math.max(...tops.at(-1)!) * 1.1;
  const x = (i: number) => (i / (DAYS - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const id = "src-sweep";
  return (
    <div className={s.card}>
      <p className={s.cardH}>New leads, by where they came from</p>
      <p className={s.cardSub}>Per day · dashed: the period before</p>
      <div className={s.legend}>
        {LAYERS.map((ly) => (
          <span key={ly.name}>
            <i style={{ background: ly.color }} />
            {ly.name}
          </span>
        ))}
      </div>
      <svg className={s.chart} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={W * sweep} height={H} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className={s.grid} />
        ))}
        <g clipPath={`url(#${id})`}>
          {[...LAYERS].reverse().map((ly, rk) => {
            const k = LAYERS.length - 1 - rk;
            const top = tops[k]!;
            const bottom = k ? tops[k - 1]! : top.map(() => 0);
            const d =
              `M${x(0)} ${y(top[0]!)} ` +
              top.map((v, i) => `L${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ") +
              ` ` +
              [...bottom]
                .reverse()
                .map((v, i) => `L${x(DAYS - 1 - i).toFixed(1)} ${y(v).toFixed(1)}`)
                .join(" ") +
              " Z";
            return <path key={ly.name} d={d} fill={ly.color} opacity={0.85} />;
          })}
          <path
            d={tops
              .at(-1)!
              .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v * 0.78 + 2 * Math.sin(i)).toFixed(1)}`)
              .join(" ")}
            className={s.dashed}
          />
        </g>
      </svg>
      <div className={s.axis}>
        {["Sep 7", "Sep 14", "Sep 22", "Sep 29", "Oct 6"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

const FUNNEL: [string, number, number, string][] = [
  ["New", 644, 100, "53 stopped here · −8%"],
  ["Message sent", 591, 92, "165 stopped here · −28%"],
  ["Replied", 426, 66, "238 stopped here · −56%"],
  ["Call booked", 188, 29, "74 stopped here · −39%"],
  ["Call done", 114, 18, "42 stopped here · −37%"],
];
/** The funnel: each bar grows to its share, one after another. */
export function Funnel({ t }: { t: number }) {
  return (
    <div className={s.card}>
      <p className={s.cardH}>
        The funnel <em>Funnel ›</em>
      </p>
      <p className={s.cardSub}>Of the leads that arrived in the last 30 days, how far they got</p>
      <div className={s.funnel}>
        {FUNNEL.map(([name, n, pct, stop], i) => {
          const g = along(t, 0.2 + i * 0.1, 0.4);
          return (
            <div key={name} className={s.step}>
              <span className={s.stepName}>{name}</span>
              <span className={s.track}>
                <i style={{ width: `${pct * g}%` }}>{Math.round(n * g)}</i>
              </span>
              <span className={s.pct}>{Math.round(pct * g)}%</span>
              <span className={s.stop} style={{ opacity: g }}>
                {stop}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const NOTES: [string, string][] = [
  ["Referrals punch above their weight", "They bring 12% of leads and 29% of revenue won."],
  [
    "Speed pays off",
    "Leads contacted within an hour were won 2.8 times as often. Your median first contact is 49 min.",
  ],
  ["43% of leads arrive after 7 pm", "Contacting them before 11 am the next morning wins more of them."],
];
/** LUME noticed: the colleague's note, each line arriving in turn. */
export function Noticed({ t }: { t: number }) {
  return (
    <div className={s.noticed}>
      <p className={s.cardH}>LUME noticed</p>
      <p className={s.cardSub}>From your numbers in the last 30 days</p>
      {NOTES.map(([h, b], i) => {
        const g = along(t, 0.25 + i * 0.2, 0.35);
        return (
          <div key={h} className={s.note} style={{ opacity: g, transform: `translateY(${14 * (1 - g)}px)` }}>
            <img src="/lume-mark.png" alt="" />
            <span>
              <b>{h}</b>
              {b}
            </span>
          </div>
        );
      })}
    </div>
  );
}
