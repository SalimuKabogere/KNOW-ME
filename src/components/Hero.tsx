"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  ArrowDown,
  Download,
  Mail,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { site } from "@/data/site";

const floatBadges = [
  { label: "React", className: "left-[6%] top-[18%]", delay: 0 },
  { label: "Next.js", className: "right-[8%] top-[12%]", delay: 0.2 },
  { label: "TypeScript", className: "left-[10%] bottom-[22%]", delay: 0.4 },
  { label: "Linux", className: "right-[6%] bottom-[28%]", delay: 0.6 },
  { label: "GitHub", className: "left-[44%] top-[6%]", delay: 0.8 },
  { label: "Cybersecurity", className: "right-[30%] bottom-[8%]", delay: 1 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-eyebrow]", {
        y: 18,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          "[data-hero-headline] .line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .from(
          "[data-hero-subtitle]",
          {
            y: 24,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.6"
        )
        .from(
          "[data-hero-cta] > *",
          {
            y: 18,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
          },
          "-=0.45"
        )
        .from(
          "[data-hero-meta]",
          {
            y: 16,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          "[data-hero-image]",
          {
            scale: 0.85,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=1.1"
        )
        .from(
          "[data-hero-badge]",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.6"
        );

      // Continuous gentle float on the profile
      gsap.to("[data-hero-image-inner]", {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-40"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-glow-radial opacity-70" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-brand-deep/20 blur-3xl" />
        <div className="absolute left-[-10%] top-[10%] h-[360px] w-[360px] rounded-full bg-brand-primary/10 blur-3xl" />
      </div>

      <div className="container-x px-5 pb-24 sm:px-8 lg:px-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          {/* Left: text */}
          <div>
            <div
              data-hero-eyebrow
              className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-3.5 py-1.5 text-xs font-medium text-brand-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Available for freelance & collaboration
            </div>

            <h1
              data-hero-headline
              className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]"
            >
              <span className="block overflow-hidden">
                <span className="line block text-gradient">Salimu Kabogere</span>
              </span>
              <span className="block overflow-hidden">
                <span className="line block text-white/85">
                  Software Developer.
                </span>
              </span>
            </h1>

            <p
              data-hero-subtitle
              className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              I build software applications and{" "}
              <span className="text-brand-primary">backend services</span>,
              passionate about{" "}
              <span className="text-brand-primary">cloud</span> and{" "}
              <span className="text-brand-primary">infrastructure</span> — with
              a growing curiosity for{" "}
              <span className="text-brand-primary">cybersecurity</span> and{" "}
              <span className="text-brand-primary">AI / ML</span>.
            </p>

            <div
              data-hero-cta
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="#projects" className="btn-primary">
                View Projects
                <ArrowDown className="h-4 w-4 -rotate-45" />
              </a>
              <a href="#contact" className="btn-ghost">
                <Mail className="h-4 w-4" />
                Contact Me
              </a>
              <a
                href={site.cvUrl}
                download
                className="btn-ghost"
              >
                <Download className="h-4 w-4" />
                Download CV
              </a>
            </div>

            <div
              data-hero-meta
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/55"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-primary" />
                Based in {site.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                Comp Sci Graduate · Building daily
              </span>
            </div>
          </div>

          {/* Right: profile + floating badges */}
          <div
            data-hero-image
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 rounded-full bg-glow-radial opacity-90" />
            <div className="absolute inset-6 rounded-full border border-brand-primary/20" />
            <div className="absolute inset-12 rounded-full border border-brand-primary/10" />

            <div
              data-hero-image-inner
              className="relative mx-auto flex h-full w-full items-center justify-center"
            >
              <div className="relative h-[78%] w-[78%] overflow-hidden rounded-full ring-soft">
                {/* Tinted backdrop sits behind the photo for a premium blue glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#5C98C2,#306C93_60%,#1F1A18)]" />
                <Image
                  src="/profile.png"
                  alt={`${site.name} — Web Developer & Cybersecurity Learner`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, 70vw"
                  className="relative z-10 object-cover"
                />
                {/* Subtle highlight + brand tint over the photo */}
                <div className="absolute inset-0 z-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)] mix-blend-overlay" />
                <div className="absolute inset-0 z-20 ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-x-10 top-4 z-30 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>

              {/* Decorative dot orbit */}
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-primary shadow-glow-blue animate-pulse-soft" />
                <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-primary/70" />
                <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-primary/70" />
              </div>
            </div>

            {/* Floating tech badges */}
            {floatBadges.map((b, i) => (
              <span
                key={b.label}
                data-hero-badge
                className={`pill absolute ${b.className} ${
                  i % 2 === 0 ? "animate-float" : "animate-float-slow"
                } shadow-card`}
                style={{ animationDelay: `${b.delay}s` }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex justify-center">
          <a
            href="#about"
            className="group inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45 hover:text-white"
          >
            Scroll
            <span className="relative inline-flex h-9 w-5 items-center justify-center rounded-full border border-white/15">
              <span className="h-2 w-1 rounded-full bg-brand-primary/80 animate-pulse-soft" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
