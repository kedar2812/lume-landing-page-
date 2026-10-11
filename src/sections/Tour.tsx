"use client";
import { useEffect, useRef, useState } from "react";
import x from "./section.module.css";
import s from "./tour.module.css";

/**
 * The product tour on Supademo: LUME clicked through for real on a sample business, about two minutes. Supademo's
 * CDN keeps each embed URL a while; bump `v` after editing the tour to show the new one at once.
 */
export const TOUR_SRC =
  "https://app.supademo.com/embed/cmv3iqdc604g2n321ivw9i38y?embed_v=2&utm_source=website&v=3";

/**
 * The tour (owner, 2026-10-11): the demo in a rounded box in front of a live gradient in the LUME mark's own blues.
 * The gradient drifts only while the band is on screen, slowly (long cycles, never a pulse), and holds still for
 * anyone who asks for less motion. The demo loads as the band comes near, not with the page.
 */
export function Tour() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="tour" className={s.section} aria-labelledby="tour-h">
      <div className="wrap">
        <div className={s.band} data-on={on || undefined}>
          <div className={s.live} aria-hidden="true">
            <span className={`${s.blob} ${s.b1}`} />
            <span className={`${s.blob} ${s.b2}`} />
            <span className={`${s.blob} ${s.b3}`} />
            <span className={`${s.blob} ${s.b4}`} />
          </div>
          <div className={s.words}>
            <p className={`${x.eyebrow} ${s.eyebrow}`}>The 2-minute tour</p>
            <h2 id="tour-h" className={`${x.h2} ${s.h}`}>
              Watch LUME answer every lead.
            </h2>
            <p className={`${x.lede} ${s.lede}`}>
              A sample business, clicked through for real: leads from ManyChat and Super Reply, assigned,
              followed up on WhatsApp and won.
            </p>
          </div>
          <div className={s.box}>
            <div className={s.frame}>
              <iframe
                src={TOUR_SRC}
                title="LUME, the 2-minute tour"
                loading="lazy"
                allow="clipboard-write; fullscreen"
                allowFullScreen
                className={s.iframe}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
