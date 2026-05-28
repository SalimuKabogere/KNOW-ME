// Crosshair "+" marks at the four corners of a bordered/relative element.
// Place inside a `relative` parent. Add `group` on the parent for the blue
// hover tint. Use `inset` for parents that clip overflow (e.g. rounded cards).
export default function Corners({ inset = false }: { inset?: boolean }) {
  const base =
    "pointer-events-none absolute flex h-3 w-3 items-center justify-center font-mono text-[11px] leading-none text-white/30 transition-colors group-hover:text-brand-primary/80";

  const pos = inset
    ? {
        tl: "left-1.5 top-1.5",
        tr: "right-1.5 top-1.5",
        bl: "left-1.5 bottom-1.5",
        br: "right-1.5 bottom-1.5",
      }
    : {
        tl: "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
        tr: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
        bl: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
        br: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
      };

  return (
    <>
      <span aria-hidden className={`${base} ${pos.tl}`}>+</span>
      <span aria-hidden className={`${base} ${pos.tr}`}>+</span>
      <span aria-hidden className={`${base} ${pos.bl}`}>+</span>
      <span aria-hidden className={`${base} ${pos.br}`}>+</span>
    </>
  );
}
