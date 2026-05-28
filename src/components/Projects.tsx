"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, ArrowUpRight } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";
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
  Live: "text-emerald-300",
  "In Progress": "text-amber-300",
  Concept: "text-white/50",
};

function CaseRow({ project, index }: { project: Project; index: number }) {
  const reverse = index % 2 === 1;
  const caseLink = project.demo && project.demo !== "#" ? project.demo : project.github;

  return (
    <article
      data-project-card
      className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Visual */}
      <div className={`relative ${reverse ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-white/[0.02]">
          {/* faux window chrome */}
          <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-1.5 border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </div>
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-top pt-8 transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-grid opacity-40">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/30">
                {project.title}
              </span>
            </div>
          )}
        </div>
        <Corners />
      </div>

      {/* Text */}
      <div className={reverse ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          <span className="text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-6 bg-white/20" />
          <span>{project.category}</span>
          <span className="h-px w-6 bg-white/20" />
          <span className={statusStyle[project.status]}>{project.status}</span>
        </div>

        <h3 className="mt-5 text-2xl font-light tracking-tight text-white sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-6">
          {caseLink && (
            <a
              href={caseLink}
              target="_blank"
              rel="noreferrer"
              className="btn-frame group"
            >
              View case
              <ArrowUpRight className="h-4 w-4" />
              <Corners />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function PipelineRow({ project }: { project: Project }) {
  return (
    <a
      data-pipeline-card
      href={project.github || "#"}
      target={project.github ? "_blank" : undefined}
      rel={project.github ? "noreferrer" : undefined}
      className="group flex items-center justify-between gap-6 border-b border-white/10 py-6 transition-colors hover:border-white/30"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>{project.category}</span>
          <span className={statusStyle[project.status]}>{project.status}</span>
        </div>
        <h4 className="mt-2 text-lg font-light text-white">{project.title}</h4>
        <p className="mt-1 max-w-xl truncate text-sm text-white/50">
          {project.description}
        </p>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-primary" />
    </a>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const featuredWrapRef = useRef<HTMLDivElement>(null);
  const pipelineWrapRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");

  const visibleFeatured = useMemo(() => {
    if (filter === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === filter);
  }, [filter]);

  const visiblePipeline = useMemo(() => {
    if (filter === "All") return upcomingProjects;
    return upcomingProjects.filter((p) => p.category === filter);
  }, [filter]);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-project-card]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: featuredWrapRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        "[data-pipeline-card]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: pipelineWrapRef.current, start: "top 88%" },
        }
      );
      gsap.fromTo(
        "[data-pipeline-heading]",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-pipeline-heading]", start: "top 90%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  // Re-animate on filter change
  useIsomorphicLayoutEffect(() => {
    const cards = featuredWrapRef.current?.querySelectorAll("[data-project-card]");
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 }
      );
    }
  }, [filter]);

  const nothingToShow =
    visibleFeatured.length === 0 && visiblePipeline.length === 0;

  return (
    <section id="projects" ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Selected work"
          title="Selected builds"
          highlight="& experiments."
          subtitle="Shipped tools, in-progress work, and concepts I'm exploring — open the case to see it live or read the code."
          align="left"
        />

        {/* Filters */}
        <div className="mb-16 flex flex-wrap gap-x-6 gap-y-2">
          {projectFilters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
                {f}
                {active && (
                  <span className="ml-2 inline-block h-1 w-1 rounded-full bg-brand-primary align-middle" />
                )}
              </button>
            );
          })}
        </div>

        {/* Featured case showcases */}
        {visibleFeatured.length > 0 && (
          <div ref={featuredWrapRef} className="space-y-24 lg:space-y-32">
            {visibleFeatured.map((project, i) => (
              <CaseRow key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Pipeline */}
        {visiblePipeline.length > 0 && (
          <>
            <div data-pipeline-heading className="mt-28 max-w-2xl">
              <p className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                <span className="h-px w-8 bg-white/25" />
                In the pipeline
              </p>
              <h3 className="text-2xl font-extralight tracking-tight text-white sm:text-3xl">
                What I&apos;m building next
              </h3>
            </div>

            <div ref={pipelineWrapRef} className="mt-10">
              {visiblePipeline.map((project) => (
                <PipelineRow key={project.slug} project={project} />
              ))}
            </div>
          </>
        )}

        {nothingToShow && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Nothing in this category yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
