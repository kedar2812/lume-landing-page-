"use client";
import { useEffect, useState } from "react";

type Box = { id: string; top: number; bottom: number };

/** The section crossing the line 40% down the window: the one being read. */
export function activeSection(boxes: Box[], viewport: number): string | null {
  const line = viewport * 0.4;
  return boxes.find((b) => b.top <= line && b.bottom > line)?.id ?? null;
}

/** Which of these sections is being read, as the page scrolls (for the Island's label). */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const boxes = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.id, top: r.top, bottom: r.bottom };
        });
      setActive(activeSection(boxes, window.innerHeight));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}
