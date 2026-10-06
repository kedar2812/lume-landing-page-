import { Reveal } from "@/motion/Reveal";
import s from "./chapter.module.css";

/** A chapter of the story opens (website spec §5.0): its number, its name, one line. */
export function Chapter({ id, n, title, line }: { id: string; n: number; title: string; line: string }) {
  return (
    <section id={id} className={s.chapter} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <Reveal y={36}>
          <p className={s.n}>Chapter {n}</p>
          <h2 id={`${id}-h`} className={s.title}>
            {title}
          </h2>
          <p className={s.line}>{line}</p>
        </Reveal>
      </div>
    </section>
  );
}
