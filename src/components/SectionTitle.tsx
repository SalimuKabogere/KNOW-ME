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
      gsap.fromTo(
        items,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const isCenter = align === "center";
  return (
    <div
      ref={ref}
      className={`mb-14 sm:mb-16 ${
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }`}
    >
      {eyebrow && (
        <p
          data-anim
          className={`mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 ${
            isCenter ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-white/25" />
          {eyebrow}
        </p>
      )}
      <h2
        data-anim
        className="text-balance text-3xl font-extralight leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {title}{" "}
        {highlight && <span className="text-brand-primary">{highlight}</span>}
      </h2>
      {subtitle && (
        <p
          data-anim
          className={`mt-5 text-sm leading-relaxed text-white/55 sm:text-base ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
