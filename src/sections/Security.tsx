import { Screen } from "@/components/Screen";
import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./security.module.css";

const PROTECTIONS = [
  {
    h: "Roles decide who sees what",
    p: "A rep sees their own leads, a team lead their team’s, you everything.",
  },
  { h: "Exports locked down", p: "Turn exports off, or have them approved first, role by role." },
  {
    h: "Every download traceable",
    p: "Each export carries a trace, so a leaked list leads back to its download.",
  },
  { h: "An alert on unusual reading", p: "LUME tells you when someone opens far more leads than usual." },
  {
    h: "Offboarding in one step",
    p: "When someone leaves, their leads and follow-ups go to someone else, and their access ends.",
  },
];

/** When someone leaves, your leads don't (website spec §5, item 12): the protections, over LUME's own screens. */
export function Security() {
  return (
    <section id="security" className={x.section} aria-labelledby="security-h">
      <div className="wrap">
        <div className={s.head}>
          <div>
            <p className={x.eyebrow}>Security</p>
            <h2 id="security-h" className={x.h2}>
              When someone leaves, your leads don’t.
            </h2>
          </div>
          <Screen name="security" alt="LUME's security overview" className={s.shot} />
        </div>
        <ul className={s.grid}>
          {PROTECTIONS.map((pr, i) => (
            <Reveal as="li" key={pr.h} delay={i * 80} className={`${x.card} ${i === 4 ? s.wide : ""}`}>
              <h3>{pr.h}</h3>
              <p>{pr.p}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
