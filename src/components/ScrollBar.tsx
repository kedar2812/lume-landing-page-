"use client";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import s from "./scrollbar.module.css";

/**
 * The site's own scrollbar (owner's request): the browser's bar is hidden; this slim thumb in LUME's blue floats at
 * the right edge, shows while you scroll or point at it, and can be dragged or clicked. Mouse and trackpad only —
 * touch screens keep their own overlay. Decorative to assistive tech: the page scrolls as it always does.
 */
export function ScrollBar() {
  const [geo, setGeo] = useState({ top: 0, size: 0, show: false });
  const idle = useRef(0);
  const drag = useRef<{ y: number; scroll: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = (reveal: boolean) => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const h = track.current?.clientHeight ?? window.innerHeight;
      const size = Math.max(44, (window.innerHeight / doc.scrollHeight) * h);
      const top = max > 0 ? (window.scrollY / max) * (h - size) : 0;
      setGeo((g) => ({ top, size, show: reveal || g.show }));
      if (reveal) {
        window.clearTimeout(idle.current);
        idle.current = window.setTimeout(() => !drag.current && setGeo((g) => ({ ...g, show: false })), 1100);
      }
    };
    const onScroll = () => read(true);
    const onResize = () => read(false);
    read(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    ro?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      window.clearTimeout(idle.current);
    };
  }, []);

  const ratio = () => {
    const doc = document.documentElement;
    const h = track.current?.clientHeight ?? window.innerHeight;
    return (doc.scrollHeight - window.innerHeight) / Math.max(1, h - geo.size);
  };
  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, scroll: window.scrollY };
    setGeo((g) => ({ ...g, show: true }));
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    window.scrollTo({
      top: drag.current.scroll + (e.clientY - drag.current.y) * ratio(),
      behavior: "instant",
    });
  };
  const up = () => {
    drag.current = null;
  };
  /** A click on the track: the page moves so the thumb centres there. */
  const jump = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    window.scrollTo({ top: (e.clientY - r.top - geo.size / 2) * ratio(), behavior: "smooth" });
  };

  return (
    <div
      ref={track}
      className={s.track}
      data-show={geo.show || undefined}
      aria-hidden="true"
      onPointerDown={jump}
    >
      <div
        className={s.thumb}
        style={{ height: geo.size, transform: `translateY(${geo.top}px)` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
    </div>
  );
}
