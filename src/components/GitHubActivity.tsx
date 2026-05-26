"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Github,
  GitCommit,
  GitPullRequest,
  Star,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import { site } from "@/data/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { icon: GitCommit, label: "Public repos", value: "12+" },
  { icon: GitPullRequest, label: "Pull requests", value: "30+" },
  { icon: Star, label: "Open-source stars", value: "Growing" },
  { icon: BookOpen, label: "Learning logs", value: "Weekly" },
];

const recent = [
  {
    name: "portfolio",
    description: "This personal portfolio site, built with Next.js + GSAP.",
    lang: "TypeScript",
  },
  {
    name: "repo-health",
    description: "GitHub repo health checker — scoring public repos.",
    lang: "TypeScript",
  },
  {
    name: "wifi-qr-poster",
    description: "Printable Wi-Fi QR posters for cafés and offices.",
    lang: "TypeScript",
  },
];

export default function GitHubActivity() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-gh-stat]", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-gh-stats]",
          start: "top 85%",
        },
      });

      gsap.from("[data-gh-repo]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: "[data-gh-repos]",
          start: "top 85%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Developer Activity"
          title="Building in"
          highlight="the open."
          subtitle="A snapshot of where I spend my coding time. The live GitHub feed will be wired up next — for now, here's the shape of it."
        />

        <div
          data-gh-stats
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              data-gh-stat
              className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:border-brand-primary/40 hover:shadow-glow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  live soon
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Recent repos */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Recent projects
              </h3>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-white"
              >
                See all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <ul
              data-gh-repos
              className="mt-5 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5"
            >
              {recent.map((r) => (
                <li
                  key={r.name}
                  data-gh-repo
                  className="group flex items-center justify-between gap-4 bg-white/[0.015] p-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      <Github className="h-3.5 w-3.5 text-white/40" />
                      salimukabogere/<span className="text-brand-primary">{r.name}</span>
                    </p>
                    <p className="mt-1 truncate text-xs text-white/55">
                      {r.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
                    {r.lang}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-primary/20 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">
                Open-source learning
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
                Code, notes, and labs — all public.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                I push almost everything I build, including small experiments
                and learning notes. Feel free to look around or open issues.
              </p>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6"
              >
                <Github className="h-4 w-4" />
                Visit GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
