// Gemensamma flaggor för vilka effekter som ska köras på den här enheten.
const mq = (q) => window.matchMedia(q);

export const reduceMotion = mq('(prefers-reduced-motion: reduce)').matches;
// Riktig mus (inte touch) -> custom cursor, magnetiska knappar, hover-effekter
export const finePointer = mq('(hover: hover) and (pointer: fine)').matches;
// Svagare enheter: små skärmar eller få CPU-kärnor får lättare effekter
export const lowPower =
  mq('(max-width: 899px)').matches || (navigator.hardwareConcurrency || 8) <= 4;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
