"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";
import { lessons } from "@/data/lessons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Lessons() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-lesson-card]",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-lesson-grid]", start: "top 82%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lessons"
      ref={ref}
      className="section-pad relative z-10 border-t border-white/10 bg-surface-ink"
    >
      <div className="container-x">
        <SectionTitle
          eyebrow="The Journey"
          title="What the road has"
          highlight="taught me."
          subtitle="From a Computer Science student at Makerere to backend and IT work at Equity Bank and engineering at AIBOS — a few lessons I've picked up building real things along the way."
        />

        <div
          data-lesson-grid
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {lessons.map((lesson, i) => (
            <div
              key={lesson.title}
              data-lesson-card
              className="card-frame group flex flex-col p-6 sm:p-7"
            >
              <div className="flex items-baseline justify-between">
                
                <span className="text-3xl font-extralight leading-none text-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-medium leading-snug text-white">
                {lesson.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {lesson.body}
              </p>

              <Corners inset />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
