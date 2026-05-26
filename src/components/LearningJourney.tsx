"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Terminal,
  Network,
  ShieldCheck,
  GitBranch,
  CloudCog,
  Award,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import { learningJourney } from "@/data/learning";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const icons: Record<string, LucideIcon> = {
  "Linux Fundamentals": Terminal,
  "Git & GitHub Workflows": GitBranch,
  "Networking Basics": Network,
  "NDG Linux Essentials Certificate": Award,
  "Web Security": ShieldCheck,
  "Cloud Security": CloudCog,
  "AI & Machine Learning": Cpu,
};

const statusColor: Record<string, string> = {
  Completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "In Progress": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Up Next": "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
};

export default function LearningJourney() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Animate timeline line growing
      gsap.from("[data-timeline-line]", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 80%",
        },
      });

      // Animate items in sequence
      gsap.from("[data-timeline-item]", {
        x: (i) => (i % 2 === 0 ? -40 : 40),
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 75%",
        },
      });

      gsap.from("[data-timeline-dot]", {
        scale: 0,
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.18,
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 75%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="learning"
      ref={ref}
      className="section-pad relative bg-[#19161486]"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-radial" />
      <div className="container-x relative">
        <SectionTitle
          eyebrow="Learning Journey"
          title="Infrastructure, security, AI —"
          highlight="step by step."
          subtitle="An honest map of where I am — what's done, what I'm actively learning (including the NDG Linux Essentials certificate), and what's next."
        />

        <div data-timeline className="relative mx-auto max-w-4xl">
          {/* Vertical line */}
          <span
            data-timeline-line
            className="absolute left-5 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-primary/60 via-brand-primary/20 to-transparent md:left-1/2 md:block"
          />
          <span
            data-timeline-line
            className="absolute left-5 top-2 block h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-primary/60 via-brand-primary/20 to-transparent md:hidden"
          />

          <ol className="space-y-10 md:space-y-14">
            {learningJourney.map((item, idx) => {
              const Icon = icons[item.title] ?? ShieldCheck;
              const isLeft = idx % 2 === 0;
              return (
                <li
                  key={item.title}
                  className="relative grid grid-cols-[40px_1fr] gap-4 md:grid-cols-2 md:gap-10"
                >
                  {/* Dot */}
                  <span
                    data-timeline-dot
                    className="absolute left-5 top-2 z-10 -translate-x-1/2 md:left-1/2"
                  >
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-brand-primary/40 blur" />
                      <span className="relative h-3 w-3 rounded-full bg-brand-primary ring-4 ring-surface-ink" />
                    </span>
                  </span>

                  {/* Mobile spacer */}
                  <span className="md:hidden" />

                  {/* Card */}
                  <div
                    data-timeline-item
                    className={`md:col-span-1 ${
                      isLeft ? "md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"
                    }`}
                  >
                    <div
                      className={`glass rounded-2xl p-6 transition-all hover:border-brand-primary/40 hover:shadow-glow-soft ${
                        isLeft ? "md:ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 ${
                          isLeft ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">
                        {item.summary}
                      </p>
                      <div
                        className={`mt-4 flex flex-wrap gap-1.5 ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        {item.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div
                        className={`mt-4 ${isLeft ? "md:text-right" : ""}`}
                      >
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusColor[item.status]}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
