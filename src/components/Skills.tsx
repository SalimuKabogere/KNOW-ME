"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Layout,
  Server,
  Smartphone,
  CloudCog,
  Wrench,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const [active, setActive] = useState(0);

  // Initial scroll-triggered reveal of the list + panel
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-skill-item]",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-skills-layout]", start: "top 80%" },
        }
      );
      gsap.fromTo(
        "[data-skill-panel]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-skills-layout]", start: "top 80%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  // Fade the detail panel when the active skill changes (skip first mount)
  useIsomorphicLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [active]);

  const group = skillGroups[active];
  const ActiveIcon = groupIcons[group.title] ?? Layout;

  return (
    <section id="skills" ref={ref} className="section-pad relative">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-radial" />
      <div className="container-x relative">
        <SectionTitle
          eyebrow="Skills"
          title="Tools I use"
          highlight="and grow with."
          subtitle="Pick an area to see what I can build and the tools I reach for."
        />

        <div
          data-skills-layout
          className="flex flex-col gap-8 md:flex-row md:gap-0"
        >
          {/* LEFT: skill list */}
          <ul className="shrink-0 space-y-1.5 md:w-[38%] md:pr-8 lg:w-[34%] lg:pr-12">
            {skillGroups.map((g, i) => {
              const Icon = groupIcons[g.title] ?? Layout;
              const isActive = i === active;
              return (
                <li key={g.title} data-skill-item>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      isActive
                        ? "border-brand-primary/40 bg-brand-primary/10"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isActive
                          ? "border-brand-primary/40 bg-brand-primary/15 text-brand-primary"
                          : "border-white/10 bg-white/[0.03] text-white/55 group-hover:text-white/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`flex-1 text-sm font-semibold transition-colors ${
                        isActive ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {g.title}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-all ${
                        isActive
                          ? "translate-x-0 text-brand-primary opacity-100"
                          : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* RIGHT: active detail panel with divider */}
          <div className="border-t border-white/10 pt-8 md:flex-1 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-12">
            <div
              ref={panelRef}
              data-skill-panel
              className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10"
            >
              {/* Text */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {group.title}
                    </h3>
                    <p className="text-sm text-brand-primary/90">
                      {group.description}
                    </p>
                  </div>
                </div>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                  {group.detail}
                </p>

                <p className="mt-7 font-mono text-xs uppercase tracking-[0.18em] text-white/40">
                  Tools I use
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href="/projects"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-primary transition-colors hover:text-white"
                >
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Illustration */}
              <div className="order-1 lg:order-2">
                <div className="group relative mx-auto aspect-square w-full max-w-xs overflow-hidden border border-white/10 lg:mx-0 lg:w-72 lg:max-w-none xl:w-80">
                  <Image
                    src={group.image}
                    alt={`${group.title} — illustration`}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 288px, (min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                  />
                  <Corners inset />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
