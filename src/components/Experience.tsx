"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";
import { experience } from "@/data/experience";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-exp-card]",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-exp-list]", start: "top 82%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={ref}
      className="section-pad relative z-10 border-t border-white/10 bg-surface-ink"
    >
      <div className="container-x">
        <SectionTitle
          eyebrow="Experience"
          title="Where I've"
          highlight="worked."
          subtitle="Roles across software engineering, backend, and enterprise IT — building real systems in production environments."
        />

        <div data-exp-list className="mx-auto max-w-4xl space-y-5">
          {experience.map((item) => (
            <div
              key={`${item.role}-${item.company}`}
              data-exp-card
              className="card-frame group p-6 sm:p-7"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white sm:text-xl">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm">
                    <span className="text-brand-primary">{item.company}</span>
                    <span className="text-white/35"> · {item.location}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {item.current && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="relative inline-flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-emerald-300/80">Current</span>
                    </span>
                  )}
                  <span>{item.period}</span>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                {item.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Corners inset />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
