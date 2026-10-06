"use client";
/* eslint-disable @next/next/no-img-element -- the hero's captures are plain image pairs swapped by CSS */
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { rectsFor } from "@/lib/screens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { heroFrame, pieces as cut, stillFrame } from "./assembly";
import s from "./hero.module.css";

const PHONE = "(max-width: 760px)";
const onMedia = (cb: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
};

/**
 * The hero (website spec §5.H, approved on the canvas): the headline, then LUME's Today built from its own pieces
 * by your scroll — nothing of it shows until you scroll; each piece comes in from the side its data comes from;
 * scrolling back takes it apart. The dashboard is the other theme to the page. As the pieces start, the two
 * buttons leave for the Island. Under reduced motion it is simply the finished picture.
 */
export function Hero({ whatsapp }: { whatsapp: string }) {
  const reduce = useReducedMotion();
  const phone = useSyncExternalStore(
    onMedia,
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // Critically damped smoothing over the scroll: the build glides, never steps.
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.7, restDelta: 0.0005 });
  const [p, setP] = useState(0);
  const [k, setK] = useState(1);
  const told = useRef(false);
  const ps = useMemo(
    () => cut(rectsFor("light", false) as Record<string, { x: number; y: number; w: number; h: number }>),
    [],
  );
  const f = reduce ? stillFrame(ps.length) : heroFrame(p, ps.length);

  useMotionValueEvent(smooth, "change", (v) => setP(v));
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lume:hero", { detail: { p } }));
    const leads = ps.findIndex((x) => x.name === "leads");
    if (!told.current && leads >= 0 && f.pieces[leads]! > 0.96 && p < 0.5) {
      told.current = true;
      window.dispatchEvent(
        new CustomEvent("lume:notify", { detail: { text: "New lead · Instagram · just now" } }),
      );
    }
  }, [p, ps, f.pieces]);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const read = () => setK(el.getBoundingClientRect().width / 1440 || 1);
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone]);

  const head = (
    <div className={s.head} style={{ transform: `translateY(${f.headY * 30}vh)`, opacity: f.headOpacity }}>
      <Image
        className={s.mark}
        src="/lume-mark.png"
        alt=""
        width={56}
        height={56}
        priority
        style={{
          filter: `drop-shadow(0 0 ${Math.round(10 + 40 * Math.min(1, p / 0.3))}px rgba(42,91,255,.85))`,
        }}
      />
      <h1 id="hero-h" className={s.h1} style={{ backgroundPosition: `${f.sweep}% 0` }}>
        Every lead, answered while it’s still warm.
      </h1>
      <p className={s.sub}>
        LUME gathers leads from Instagram, your website and sheets, puts the next follow-up in front of the
        right person, and sends it on WhatsApp in one tap.
      </p>
      <div
        className={s.ctas}
        style={{ opacity: f.ctas, transform: `translateY(${-24 * (1 - f.ctas)}px)` }}
        aria-hidden={f.ctas < 0.5 || undefined}
      >
        <a className={s.book} href="#enquire" tabIndex={f.ctas < 0.5 ? -1 : undefined}>
          Book a demo
        </a>
        <a className={s.wa} href={`https://wa.me/${whatsapp}`} tabIndex={f.ctas < 0.5 ? -1 : undefined}>
          <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={22} height={22} />
          WhatsApp us
        </a>
      </div>
    </div>
  );

  // A phone: the headline, then LUME's phone Today rising into place with the scroll.
  if (phone)
    return (
      <section id="top" className={`${s.hero} ${s.phone}`} aria-labelledby="hero-h">
        <div ref={track} className={s.phoneTrack}>
          <div className={s.phoneSticky}>
            {head}
            <div
              className={s.device}
              style={{
                transform: `translateY(${reduce ? 0 : 140 * (1 - Math.min(1, p / 0.6))}px) scale(${reduce ? 1 : 0.9 + 0.1 * Math.min(1, p / 0.6)})`,
                opacity: reduce ? 1 : Math.min(1, 0.15 + p / 0.35),
              }}
            >
              <img
                className={s.invLight}
                src="/screens/today-light-phone.webp"
                alt="LUME's Today on a phone"
                width={390}
                height={844}
              />
              <img
                className={s.invDark}
                src="/screens/today-dark-phone.webp"
                alt=""
                width={390}
                height={844}
              />
            </div>
            {!reduce && f.hint && <Hint />}
          </div>
        </div>
      </section>
    );

  return (
    <section id="top" className={s.hero} aria-labelledby="hero-h">
      <div ref={track} className={s.track}>
        <div className={s.sticky}>
          <div className={s.glow} style={{ opacity: f.glow }} aria-hidden="true" />
          {head}
          <div className={s.stageWrap} style={{ "--drop": `${f.drop * 38}vh` } as CSSProperties}>
            <div
              ref={stage}
              className={s.stage}
              style={{ transform: `rotateX(${f.tilt}deg) scale(${f.scale})` } as CSSProperties}
            >
              <div
                className={s.frame}
                style={{ opacity: Math.max(0, (f.scale - 0.94) / 0.06) }}
                aria-hidden="true"
              />
              {reduce ? (
                <span className={s.whole}>
                  <img
                    className={s.invLight}
                    src="/screens/today-light.webp"
                    alt="LUME's Today: the day's follow-ups and calls, new leads, revenue, the pipeline, the team and replies"
                    width={1440}
                    height={900}
                  />
                  <img
                    className={s.invDark}
                    src="/screens/today-dark.webp"
                    alt=""
                    width={1440}
                    height={900}
                  />
                </span>
              ) : (
                <>
                  <div
                    className={`${s.base} ${s.shot}`}
                    style={{ opacity: f.base }}
                    role="img"
                    aria-label="LUME's Today: the day's follow-ups and calls, new leads, revenue, the pipeline, the team and replies"
                  />
                  {ps.map((pc, i) => {
                    const t = f.pieces[i]!;
                    const away = 1 - t;
                    return (
                      <div
                        key={pc.name}
                        className={`${s.piece} ${s.shot}`}
                        aria-hidden="true"
                        style={{
                          left: `${pc.left}%`,
                          top: `${pc.top}%`,
                          width: `${pc.width}%`,
                          height: `${pc.height}%`,
                          backgroundSize: pc.bgSize,
                          backgroundPosition: pc.bgPos,
                          opacity: Math.min(1, t * 2.2),
                          transform: `translate(${pc.from.x * away * k}px, ${pc.from.y * away * k}px) rotate(${pc.from.rotate * away}deg) scale(${0.9 + 0.1 * t})`,
                          boxShadow: `0 18px 50px rgba(0,0,0,${(0.35 * away + 0.05).toFixed(2)})`,
                          visibility: t <= 0 ? "hidden" : "visible",
                        }}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
          {!reduce && f.hint && <Hint />}
        </div>
      </div>
    </section>
  );
}

function Hint() {
  return (
    <div className={s.hint} aria-hidden="true">
      <span className={s.mouse} />
      Scroll to bring LUME together
    </div>
  );
}
