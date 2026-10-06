/* eslint-disable @next/next/no-img-element -- the LUME mark inside the rebuilt app */
import type { ReactNode } from "react";
import { Ico } from "./icons";
import l from "./lume.module.css";
import s from "./today.module.css";

/**
 * Today's nine parts, rebuilt in HTML from the demo business's afternoon (the site's capture, the same numbers):
 * each fills the box the hero gives it, at the positions LUME itself lays them out (today-*.rects.json).
 */
const Head = ({ icon, children, right }: { icon: ReactNode; children: ReactNode; right?: ReactNode }) => (
  <div className={s.head}>
    {icon}
    <span>{children}</span>
    {right && <em>{right}</em>}
  </div>
);

function Greeting() {
  return (
    <div className={s.greeting}>
      <img src="/lume-mark.png" alt="" className={s.mark} />
      <div>
        <p className={s.hello}>Good afternoon, Maya</p>
        <p>
          Start with <b className={s.red}>Lina Farah</b>, due at 1:24 pm. Then{" "}
          <b className={s.blue}>Sara Nasser’s call at 6:29 pm</b>.
        </p>
      </div>
      <span className={s.date}>October 6, Tuesday</span>
      <span className={s.live}>
        <i />
        Live
      </span>
      <span className={s.needs}>
        Needs you <i>1</i>
      </span>
    </div>
  );
}

/** Hours 8 am → 9 pm across the track. */
const at = (h: number) => `${((h - 8) / 13) * 100}%`;
const DOTS: [number, string][] = [
  [12.75, "ok"],
  [13.1, "bad"],
  [13.45, "ok"],
  [13.7, "bad"],
  [15.0, "due"],
  [15.4, "due"],
  [16.4, "due"],
  [17.9, "next"],
  [18.48, "next"],
];

function Day() {
  return (
    <div className={s.card}>
      <Head icon={Ico.today} right="2 calls · 12 follow-ups">
        Your day
      </Head>
      <div className={s.line}>
        <div className={s.track} />
        {DOTS.map(([h, k]) => (
          <i key={h} className={s.dot} data-k={k} style={{ left: at(h) }} />
        ))}
        <span className={s.now} style={{ left: at(14.65) }}>
          <b>2:39</b>
        </span>
        <span className={s.flag} style={{ left: at(13.9) }}>
          {Ico.check} Priya 1:54 pm
        </span>
        <span className={`${s.flag} ${s.flagBlue}`} style={{ left: at(18.48) }}>
          {Ico.video} Sara 6:29 pm
        </span>
        <div className={s.hours}>
          {["8 am", "10", "12 pm", "2", "4", "6", "8", "9 pm"].map((h, i) => (
            <span key={h} style={{ left: at([8, 10, 12, 14, 16, 18, 20, 21][i]!) }}>
              {h}
            </span>
          ))}
        </div>
      </div>
      <div className={s.next}>
        <span className={s.vid}>{Ico.video}</span>
        <span>
          <b>Sara Nasser · Pricing walkthrough</b>
          <small>Next call · In 3 h 49 min</small>
        </span>
        <em>6:29 pm</em>
        <span className={s.btn}>Open lead</span>
      </div>
    </div>
  );
}

const WORK: [string, string, string, string, string, "bad" | "due" | ""][] = [
  ["LF", "#d23b3b", "Lina Farah", "No contact for 3 days", "Was 1:24 pm", "bad"],
  ["KA", "#c93163", "Karim Aziz", "Send the brochure", "Was 2:09 pm", "bad"],
  ["PM", "#c42f2f", "Priya Menon", "Follow up", "In 15 min", "due"],
  ["SN", "#127046", "Sara Nasser", "Confirm the date", "In 45 min", "due"],
  ["OH", "#11683f", "Omar Haddad", "Follow up", "4:24 pm", ""],
  ["AK", "#b02a6e", "Aisha Khan", "Share the quote", "5:54 pm", ""],
  ["AT", "#a35b12", "Ayaan Tan", "Follow up", "6:29 pm", ""],
];

function Work() {
  return (
    <div className={s.card}>
      <div className={s.head}>
        {Ico.list}
        <span>Up next</span>
        <span className={s.tabs}>
          <b>
            All <i>10</i>
          </b>
          <span>
            Overdue <i>2</i>
          </span>
          <span>
            Calls <i>1</i>
          </span>
        </span>
        <em>
          3 of 12 done <span className={s.ring} />
        </em>
      </div>
      <div className={s.rows}>
        {WORK.map(([ini, c, name, what, when, k]) => (
          <div key={name} className={s.row}>
            <span className={s.box} />
            <span className={l.avatar} style={{ background: c }}>
              {ini}
            </span>
            <b>{name}</b>
            <span className={s.what}>{what}</span>
            <em data-k={k || undefined}>{when}</em>
          </div>
        ))}
      </div>
      <span className={s.more}>Show all 10</span>
    </div>
  );
}

const BARS = [3, 5, 4, 8, 11, 12, 9, 13, 6, 14, 8, 26, 22, 18, 9, 10];
function Leads() {
  return (
    <div className={s.tile}>
      <Head icon={Ico.leads}>Leads</Head>
      <p className={s.big}>
        33 <span>new today</span>
      </p>
      <p className={s.vs}>
        <span className={l.up}>{Ico.trendUp} +73.7%</span> vs last Tuesday by now
      </p>
      <div className={s.bars}>
        {BARS.map((h, i) => (
          <i key={i} style={{ height: h * 2, opacity: i > 13 ? 0.35 : 1 }} />
        ))}
      </div>
      <p className={s.foot}>
        <b>7</b> with no one yet
      </p>
    </div>
  );
}

function Revenue() {
  return (
    <div className={`${s.tile} ${s.money}`}>
      <Head icon={Ico.rupee}>Revenue · October</Head>
      <p className={s.big}>
        ₹11.2L <span>won</span>
      </p>
      <p className={s.vs}>
        <span className={s.upWhite}>{Ico.trendUp} +98.9%</span> vs Sep 1–6
      </p>
      <div className={s.progress}>
        <i style={{ width: "23%" }} />
      </div>
      <p className={s.split}>
        <span>23% of ₹49.7L</span>
        <span>25 days left</span>
      </p>
      <p className={s.pace}>
        At this pace: <b>₹57.9L</b> by Oct 31
      </p>
    </div>
  );
}

function Pipeline() {
  return (
    <div className={s.tile}>
      <Head icon={Ico.pipeline}>Pipeline</Head>
      <p className={s.big}>
        2,005 <span>open leads</span>
      </p>
      <div className={s.stack}>
        {[22, 18, 16, 15, 12, 9, 8].map((w, i) => (
          <i key={i} style={{ flex: w, opacity: 0.35 + i * 0.1 }} />
        ))}
      </div>
      <div className={s.stats}>
        <span>
          <b>
            <i /> 119
          </b>
          Call done
        </span>
        <span>
          <b>
            <i /> 57
          </b>
          Follow-up later
        </span>
        <span>
          <b>
            <i data-k="ok" /> 22
          </b>
          Won this month
        </span>
      </div>
      <p className={s.foot}>
        <b>₹1.1Cr</b> forecast
      </p>
    </div>
  );
}

function Calendar() {
  return (
    <div className={s.tile}>
      <Head icon={Ico.calendar}>Calendar</Head>
      <p className={s.big}>
        2 <span>calls today</span>
      </p>
      <div className={s.week}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>
            <i data-on={i === 1 || undefined} />
            {d}
          </span>
        ))}
      </div>
      <p className={s.foot}>
        <b>1</b> held today · 2 this week
      </p>
    </div>
  );
}

function Team() {
  const rows: [string, string, string, number][] = [
    ["HI", "#b02a6e", "Hana Ito", 3],
    ["AM", "#9c2a5c", "Aarav Mehta", 2],
    ["MK", "#a3285a", "Maya Kapoor", 2],
  ];
  return (
    <div className={s.tile}>
      <Head icon={Ico.team}>Team</Head>
      <p className={s.big}>
        16 <span>overdue right now</span>
      </p>
      <div className={s.people}>
        {rows.map(([ini, c, n, k]) => (
          <span key={n}>
            <span className={l.avatar} style={{ background: c, width: 22, height: 22, fontSize: 8 }}>
              {ini}
            </span>
            {n}
            <i style={{ width: k * 17 }} />
            <b>{k}</b>
          </span>
        ))}
      </div>
      <p className={s.foot}>
        <b>91%</b> done on time this month
      </p>
    </div>
  );
}

function Replies() {
  return (
    <div className={s.tile}>
      <Head icon={Ico.reply}>Replies</Head>
      <p className={s.big}>
        67% <span>replied · last 7 days</span>
      </p>
      <p className={s.vs}>
        <span className={l.up}>{Ico.trendUp} +4.5 pts</span> vs the 7 days before
      </p>
      <svg className={s.wave} viewBox="0 0 224 50" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 C 25 30, 45 30, 70 22 S 115 26, 135 16 S 165 2, 185 14 S 210 34, 224 42 L224 50 L0 50 Z" />
        <path d="M0 20 C 25 30, 45 30, 70 22 S 115 26, 135 16 S 165 2, 185 14 S 210 34, 224 42" />
      </svg>
      <p className={s.foot}>No template sent 10+ times yet</p>
    </div>
  );
}

/** By the name of its box in today-*.rects.json. */
export const TODAY_PARTS: Record<string, () => ReactNode> = {
  greeting: Greeting,
  day: Day,
  work: Work,
  leads: Leads,
  revenue: Revenue,
  pipeline: Pipeline,
  calendar: Calendar,
  team: Team,
  replies: Replies,
};
