/** Critically damped by default (apple-design §4); a little bounce only after a gesture carried momentum. */
export const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;
export const SPRING_SOFT = { type: "spring", bounce: 0.12, duration: 0.7 } as const;
