"use client";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Funnel, Header, Noticed, Sources, Tile, TILES } from "@/components/lume/analytics";
import { Chrome } from "@/components/lume/Chrome";
import l from "@/components/lume/lume.module.css";
import { along, useBuild } from "@/motion/build";
import { useReducedMotion } from "@/motion/useReducedMotion";
import s from "./analyticsbuild.module.css";

const PHONE = "(max-width: 760px)";
const noop = () => () => undefined;
const onMedia = (cb: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
};
/** Where the parts sit on LUME's 1440 × 900 canvas (as the app lays out its Overview). */
const COL = (1088 - 5 * 11) / 6;
const tileBox = (i: number): CSSProperties => ({
  left: 294 + (i % 6) * (COL + 11),
  top: i < 6 ? 238 : 356,
  width: COL,
  height: i < 6 ? 107 : 130,
});

const TITLE = "Analytics that read like a colleague’s note.";

/**
 * Analytics, built by the scroll (owner's request: "like the hero"): LUME's Overview rebuilt in HTML, in the other
 * theme to the page. The frame settles, the tiles land in a wave and count up, their lines draw, the chart sweeps
 * in, the funnel grows, and LUME's note lifts out over it. Reversible; reduced motion shows it finished. On a
 * phone, the same tiles at full size in a grid, building as they come into view.
 */
export function AnalyticsBuild() {
  const reduce = useReducedMotion();
  const phone = useSyncExternalStore(
    onMedia,
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.7, restDelta: 0.0005 });
  const [raw, setRaw] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => setRaw(v));
  // Rendered finished on the server (so it reads without JavaScript); built by the scroll once the page is live.
  const live = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const still = reduce || !live;
  const gp = useBuild(grid);
  const p = still ? 1 : raw;
  const [k, setK] = useState(0.75);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const read = () => setK(el.offsetWidth / 1440 || 0.75);
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone]);

  const head = (
    <div className={s.head}>
      <p className={s.eyebrow}>Analytics</p>
      <h2 id="analytics-h" className={s.h}>
        {TITLE}
      </h2>
    </div>
  );

  if (phone)
    return (
      <section ref={grid} id="analytics" className={s.phone} aria-labelledby="analytics-h">
        <div className="wrap">
          {head}
          <div className={`${l.tokens} ${s.grid}`}>
            {TILES.map((d, i) => {
              const g = still ? 1 : along(gp, 0.05 + i * 0.04, 0.35);
              return (
                <div
                  key={d.name}
                  data-build=""
                  style={{ opacity: g, transform: g >= 1 ? "none" : `translateY(${30 * (1 - g)}px)` }}
                >
                  <Tile d={d} t={still ? 1 : along(gp, 0.1 + i * 0.04, 0.5)} />
                </div>
              );
            })}
            <div className={s.phoneNote} data-build="" style={{ opacity: still ? 1 : along(gp, 0.55, 0.3) }}>
              <Noticed t={still ? 1 : along(gp, 0.55, 0.45)} />
            </div>
          </div>
        </div>
      </section>
    );

  const frame = along(p, 0, 0.1);
  const header = along(p, 0.05, 0.1);
  const cards = along(p, 0.4, 0.12);
  const lift = along(p, 0.7, 0.16);
  return (
    <section ref={grid} id="analytics" className={s.section} aria-labelledby="analytics-h">
      <div ref={track} className={s.track}>
        <div className={s.sticky}>
          {head}
          <div className={s.stageWrap}>
            <div ref={stage} className={s.stage}>
              <div className={s.glass} style={{ opacity: frame }} aria-hidden="true" />
              <div
                className={`${l.tokens} ${l.app} ${s.canvas}`}
                style={{ zoom: k, background: "transparent" } as CSSProperties}
                role="img"
                aria-label="LUME's Analytics overview: new leads, contact and reply rates, calls, wins and revenue against the month before, leads by source, the funnel, and what LUME noticed"
              >
                <div className={s.ground} style={{ opacity: frame }} />
                <Chrome page="Analytics" style={{ opacity: frame }} />
                <div className={s.part} style={{ left: 294, top: 98, width: 1088, height: 130 }}>
                  <Header t={header} />
                </div>
                {TILES.map((d, i) => {
                  const g = along(p, 0.1 + i * 0.022, 0.16);
                  return (
                    <div
                      key={d.name}
                      className={s.part}
                      style={{
                        ...tileBox(i),
                        opacity: g,
                        transform:
                          g >= 1 ? "none" : `translateY(${-70 * (1 - g)}px) scale(${0.94 + 0.06 * g})`,
                      }}
                    >
                      <Tile d={d} t={along(p, 0.13 + i * 0.022, 0.28)} />
                    </div>
                  );
                })}
                <div
                  className={s.part}
                  style={{
                    left: 294,
                    top: 500,
                    width: 653,
                    height: 400,
                    opacity: cards,
                    transform: cards >= 1 ? "none" : `translateY(${60 * (1 - cards)}px)`,
                  }}
                >
                  <Sources t={along(p, 0.44, 0.26)} />
                </div>
                <div
                  className={s.part}
                  style={{
                    left: 961,
                    top: 500,
                    width: 421,
                    height: 400,
                    opacity: cards,
                    transform: cards >= 1 ? "none" : `translateY(${60 * (1 - cards)}px)`,
                  }}
                >
                  <Funnel t={along(p, 0.46, 0.26)} />
                </div>
                <div
                  className={s.part}
                  style={{
                    left: 520,
                    top: 430,
                    width: 470,
                    opacity: lift,
                    transform:
                      lift >= 1 ? "none" : `translateY(${90 * (1 - lift)}px) scale(${0.9 + 0.1 * lift})`,
                  }}
                >
                  <Noticed t={along(p, 0.72, 0.22)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
