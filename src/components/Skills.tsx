"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Layout,
  Server,
  Smartphone,
  CloudCog,
  Wrench,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import { skillGroups } from "@/data/skills";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const groupIcons: Record<string, LucideIcon> = {
  Backend: Server,
  Frontend: Layout,
  Mobile: Smartphone,
  "Cloud & Infrastructure": CloudCog,
  "Workflow & Systems": Wrench,
  "Currently Learning": GraduationCap,
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-skill-group]", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-skill-grid]",
          start: "top 80%",
        },
      });

      gsap.from("[data-skill-pill]", {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.025,
        scrollTrigger: {
          trigger: "[data-skill-grid]",
          start: "top 75%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className="section-pad relative bg-[#19161486]"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-radial" />
      <div className="container-x relative">
        <SectionTitle
          eyebrow="Skills"
          title="Tools I use"
          highlight="and grow with."
          subtitle="A snapshot of my current toolkit — the technologies I'm comfortable with, plus the areas I'm actively levelling up in."
        />

        <div
          data-skill-grid
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => {
            const Icon = groupIcons[group.title] ?? Layout;
            return (
              <div
                key={group.title}
                data-skill-group
                className="group glass rounded-2xl p-6 transition-all hover:border-brand-primary/40 hover:shadow-glow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {group.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-white/55">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      data-skill-pill
                      className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/75 transition-all hover:-translate-y-0.5 hover:border-brand-primary/50 hover:bg-brand-primary/10 hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
