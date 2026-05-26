"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Construction, ArrowUpRight } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";
import {
  featuredProjects,
  upcomingProjects,
  projectFilters,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const statusStyle: Record<Project["status"], string> = {
  Live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "In Progress": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Concept: "border-white/15 bg-white/5 text-white/65",
};

function PipelineCard({ project }: { project: Project }) {
  return (
    <article
      data-pipeline-card
      className="group relative flex h-full flex-col rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-6 transition-all hover:-translate-y-1 hover:border-brand-primary/40 hover:bg-white/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {project.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusStyle[project.status]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {project.status}
        </span>
      </div>

      <h3 className="mt-4 flex items-start justify-between gap-3 text-base font-semibold text-white">
        <span>{project.title}</span>
        <ArrowUpRight className="h-4 w-4 -translate-y-0.5 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:text-brand-primary" />
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.github && (
        <div className="mt-5 border-t border-white/5 pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/65 transition-colors hover:text-brand-primary"
          >
            <Github className="h-3.5 w-3.5" /> View on GitHub
          </a>
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const featuredGridRef = useRef<HTMLDivElement>(null);
  const pipelineGridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");

  const visibleFeatured = useMemo(() => {
    if (filter === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === filter);
  }, [filter]);

  const visiblePipeline = useMemo(() => {
    if (filter === "All") return upcomingProjects;
    return upcomingProjects.filter((p) => p.category === filter);
  }, [filter]);

  // Initial scroll-triggered reveal
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-project-card]", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: featuredGridRef.current,
          start: "top 82%",
        },
      });

      gsap.from("[data-pipeline-card]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: pipelineGridRef.current,
          start: "top 85%",
        },
      });

      gsap.from("[data-pipeline-heading]", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-pipeline-heading]",
          start: "top 90%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Re-animate on filter change
  useIsomorphicLayoutEffect(() => {
    if (featuredGridRef.current) {
      const cards = featuredGridRef.current.querySelectorAll("[data-project-card]");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06 }
        );
      }
    }
    if (pipelineGridRef.current) {
      const cards = pipelineGridRef.current.querySelectorAll("[data-pipeline-card]");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.05 }
        );
      }
    }
  }, [filter]);

  const nothingToShow =
    visibleFeatured.length === 0 && visiblePipeline.length === 0;

  return (
    <section id="projects" ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Projects"
          title="Selected"
          highlight="builds & experiments."
          subtitle="A mix of shipped tools, in-progress work, and concepts I'm exploring. Click through to see the code."
        />

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {projectFilters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  active
                    ? "border-brand-primary/60 bg-brand-primary/15 text-white shadow-glow-blue"
                    : "border-white/10 bg-white/[0.03] text-white/65 hover:border-brand-primary/30 hover:text-white"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Featured grid */}
        {visibleFeatured.length > 0 && (
          <div
            ref={featuredGridRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleFeatured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}

        {/* Pipeline / in-development */}
        {visiblePipeline.length > 0 && (
          <>
            <div
              data-pipeline-heading
              className="mt-24 flex flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-brand-primary/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-primary">
                <Construction className="h-3.5 w-3.5" />
                In the pipeline
              </span>
              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                What I'm building next
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                Concepts and side projects that are still being shaped — code is
                public as they take form.
              </p>
            </div>

            <div
              ref={pipelineGridRef}
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visiblePipeline.map((project) => (
                <PipelineCard key={project.slug} project={project} />
              ))}
            </div>
          </>
        )}

        {nothingToShow && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/55">
            Nothing here yet — projects in this category are still being shaped.
            Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
