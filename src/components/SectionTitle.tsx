"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const items = ref.current!.querySelectorAll("[data-anim]");
      gsap.from(items, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const isCenter = align === "center";
  return (
    <div
      ref={ref}
      className={`mb-16 sm:mb-20 ${
        isCenter ? "mx-auto max-w-4xl text-center" : "max-w-3xl"
      }`}
    >
      {eyebrow && (
        <p
          data-anim
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(121,178,218,0.8)]" />
          {eyebrow}
        </p>
      )}
      <h2
        data-anim
        className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]"
      >
        {title}{" "}
        {highlight && <span className="text-gradient-blue">{highlight}</span>}
      </h2>
      {subtitle && (
        <p
          data-anim
          className={`mt-6 text-base leading-relaxed text-white/60 sm:text-lg ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
