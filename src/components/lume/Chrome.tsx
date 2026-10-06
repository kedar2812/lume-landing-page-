/* eslint-disable @next/next/no-img-element -- the LUME mark inside the rebuilt app, drawn at the app's size */
import type { CSSProperties, ReactNode } from "react";
import { Ico } from "./icons";
import s from "./lume.module.css";

const NAV = [
  ["Today", Ico.today],
  ["Leads", Ico.leads],
  ["Pipeline", Ico.pipeline],
  ["Calendar", Ico.calendar],
  ["Templates", Ico.templates],
  ["Analytics", Ico.analytics],
  ["Settings", Ico.settings],
] as const;
const VIEWS = [
  ["My overdue", "var(--danger)", "2"],
  ["New today", "var(--accent)", "33"],
  ["No reply 3+ days", "var(--warn)", "0"],
  ["Lost — re-engage", "var(--sky)", "544"],
] as const;

/** LUME's frame — sidebar and top bar — exactly as the app draws it, on the demo business. */
export function Chrome({
  page,
  style,
  children,
}: {
  page: "Today" | "Analytics";
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <>
      <div className={s.side} style={style}>
        <div className={s.brand}>
          <img src="/lume-mark.png" alt="" />
          <span>
            <b>LUME</b>
            <small>Brightpath Studio</small>
          </span>
        </div>
        <div className={s.nav}>
          {NAV.map(([n, icon]) => (
            <span key={n} data-on={n === page || undefined}>
              {icon}
              {n}
            </span>
          ))}
        </div>
        <div className={s.views}>
          <p>VIEWS</p>
          {VIEWS.map(([n, c, k]) => (
            <span key={n}>
              <i style={{ background: c }} />
              {n}
              <em>{k}</em>
            </span>
          ))}
        </div>
        <div className={s.me}>
          <span className={s.avatar} style={{ background: "#2a5bff", width: 30, height: 30 }}>
            MK
          </span>
          <span>
            <b>Maya Kapoor</b>
            <small>Owner</small>
          </span>
        </div>
      </div>
      <div className={s.sheet} style={style}>
        <div className={s.top}>
          <span className={s.title}>{page}</span>
          <span className={s.search}>
            {Ico.search}
            Search leads, actions…
            <kbd>Ctrl K</kbd>
          </span>
          <span className={s.seg}>
            <span data-on="">Auto</span>
            <span>Porcelain</span>
            <span>Obsidian</span>
          </span>
          <span className={s.bell}>{Ico.bell}</span>
        </div>
        {children}
      </div>
    </>
  );
}
