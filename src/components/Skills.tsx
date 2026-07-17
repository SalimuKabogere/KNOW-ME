"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import SkillArt, { type ArtKind } from "./SkillArt";
import { skillGroups } from "@/data/skills";

/**
 * anime.js-style bento grid: hairline-bordered tiles, each with a small
 * always-running inline-SVG demo, mono labels, and staggered reveals.
 * Wide tiles (first and last) also carry the long-form detail copy.
 */
const tileConfig: Record<string, { art: ArtKind; span?: string; detail?: boolean }> = {
  Backend: { art: "backend", span: "sm:col-span-2", detail: true },
  Frontend: { art: "frontend" },
  Mobile: { art: "mobile" },
  "Cloud & Infrastructure": { art: "cloud" },
  "Workflow & Systems": { art: "workflow" },
  "Currently Learning": {
    art: "learning",
    span: "sm:col-span-2 lg:col-span-3",
    detail: true,
  },
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Tiles cascade in as the grid enters the viewport.
      gsap.fromTo(
        "[data-skill-tile]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-skills-grid]", start: "top 82%" },
        }
      );

      // Draw-in strokes: every [data-draw] element carries pathLength=1,
      // so dashoffset animates 1 → (1 - progress) regardless of geometry.
      // Progress rings pass their fill level via data-progress; plain
      // decorative paths omit it and draw fully.
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((el) => {
        const progress = parseFloat(el.getAttribute("data-progress") ?? "1");
        gsap.fromTo(
          el,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 1 - progress,
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={ref} className="section-pad relative">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-radial" />
      <div className="container-x relative">
        <SectionTitle
          eyebrow="Skills"
          title="Tools I use"
          highlight="and grow with."
          subtitle="Every area, laid out — with the tools I reach for and where I'm levelling up."
        />

        <div
          data-skills-grid
          className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group, i) => {
            const config = tileConfig[group.title] ?? { art: "frontend" as ArtKind };
            return (
              <article
                key={group.title}
                data-skill-tile
                className={`group relative flex flex-col bg-surface-ink p-6 transition-colors duration-300 hover:bg-white/[0.02] sm:p-7 ${
                  config.span ?? ""
                }`}
              >
                <header className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-brand-primary/70">
                    {group.description}
                  </span>
                </header>

                <h3 className="mt-4 font-pixel text-xl text-white">
                  {group.title}
                </h3>

                {config.detail && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
                    {group.detail}
                  </p>
                )}

                <div className={`mt-6 ${config.span ? "h-36" : "h-32"}`}>
                  <SkillArt kind={config.art} />
                </div>

                {group.title === "Currently Learning" ? (
                  /* Marquee of learning topics, anime.js-style ticker */
                  <div className="marquee mt-6 border-t border-white/10 pt-4">
                    <div className="marquee-track">
                      {[0, 1].map((half) => (
                        <div key={half} className="flex shrink-0 items-center">
                          {[...group.items, ...group.items].map((item, j) => (
                            <span
                              key={`${half}-${j}`}
                              className="flex items-center whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
                            >
                              {item}
                              <span className="mx-5 text-brand-primary/60">·</span>
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="border border-white/10 bg-white/[0.02] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60 transition-colors group-hover:border-white/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-primary transition-colors hover:text-white"
          >
            See these in projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
