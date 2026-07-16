"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type SplitType = "chars" | "words" | "lines" | "words, chars" | "lines, chars";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  splitType?: SplitType;
  /** "scroll" reveals when the element enters the viewport, "mount" plays immediately. */
  trigger?: "scroll" | "mount";
  /** Extra delay (seconds) before the reveal starts. */
  delay?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start position, only used when trigger === "scroll". */
  start?: string;
  ease?: string;
};

/**
 * Splits its rendered DOM content into GSAP SplitText chars/words/lines
 * (preserving nested markup like colored spans) and staggers them in.
 * The full text is present in the initial markup for SEO/no-JS — SplitText
 * only reshapes it client-side after mount.
 */
export default function AnimatedText({
  children,
  as: Tag = "span",
  className = "",
  splitType = "chars",
  trigger = "scroll",
  delay = 0,
  duration = 0.9,
  stagger = 0.02,
  start = "top 85%",
  ease = "power4.out",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: splitType,
        mask: splitType.includes("lines") ? "lines" : "words",
        autoSplit: true,
        onSplit(self) {
          const targets =
            self.chars.length > 0
              ? self.chars
              : self.words.length > 0
                ? self.words
                : self.lines;

          return gsap.from(targets, {
            yPercent: 115,
            opacity: 0,
            duration,
            stagger,
            ease,
            delay,
            scrollTrigger:
              trigger === "scroll"
                ? { trigger: el, start, once: true }
                : undefined,
          });
        },
      });

      return () => split.revert();
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitType, trigger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
