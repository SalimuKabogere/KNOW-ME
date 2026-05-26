"use client";

import Image from "next/image";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

const accentMap = {
  blue: {
    grad: "from-brand-primary/40 via-brand-medium/20 to-brand-deep/10",
    glyph: "text-brand-primary",
    chip: "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  },
  deep: {
    grad: "from-brand-deep/50 via-brand-medium/20 to-brand-primary/10",
    glyph: "text-brand-medium",
    chip: "border-brand-medium/30 bg-brand-medium/10 text-brand-medium",
  },
  warm: {
    grad: "from-neutral-brown/40 via-neutral-warm/20 to-brand-deep/10",
    glyph: "text-neutral-warm",
    chip: "border-neutral-warm/30 bg-neutral-warm/10 text-neutral-warm",
  },
} as const;

const statusStyle: Record<Project["status"], string> = {
  Live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "In Progress": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Concept: "border-white/15 bg-white/5 text-white/65",
};

export default function ProjectCard({ project }: { project: Project }) {
  const a = accentMap[project.accent];

  return (
    <article
      data-project-card
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow-soft"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle darkening + brand wash so overlaid labels stay readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-ink via-surface-ink/40 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-br ${a.grad} mix-blend-overlay opacity-60`} />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${a.grad}`} />
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
            {/* Faux window chrome only on the placeholder */}
            <div className="absolute inset-x-4 top-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
          <p className={`font-mono text-xs uppercase tracking-[0.18em] ${a.glyph}`}>
            {project.category}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${statusStyle[project.status]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {project.status}
          </span>
        </div>

        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-brand-primary/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-3 text-lg font-semibold text-white">
          <span>{project.title}</span>
          <ArrowUpRight className="h-4 w-4 -translate-y-0.5 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:text-brand-primary" />
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/65"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-white/5 pt-5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:border-brand-primary/40 hover:text-white"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-xs font-medium text-white shadow-glow-blue"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
