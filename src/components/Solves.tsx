import { PROBLEMS } from "@/sections/Problems";
import s from "./solves.module.css";

/** The tag on each of LUME's answers: which numbered problem it solves, linking back to it (website spec §5.0). */
export function Solves({ n }: { n: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const id = String(n).padStart(2, "0");
  return (
    <a className={s.tag} href={`#problem-${id}`}>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Solves {id} · {PROBLEMS[n - 1]!.title.replace(/\.$/, "")}
    </a>
  );
}
