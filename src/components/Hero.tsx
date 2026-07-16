"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { site } from "@/data/site";
import Corners from "./Corners";
import DotMatrixText from "./DotMatrixText";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * Splits its text into per-letter spans that tilt in 3D as the cursor moves
 * over them — rotation axis and strength follow the cursor's position and
 * velocity, and the letters spring back upright on leave.
 */
function TiltName({ text }: { text: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const now = performance.now();
    const prev = last.current;
    const dt = prev ? Math.max(now - prev.t, 8) : 16;
    const vx = prev ? clamp((e.clientX - prev.x) / dt, -1.5, 1.5) : 0;
    const vy = prev ? clamp((e.clientY - prev.y) / dt, -1.5, 1.5) : 0;
    last.current = { x: e.clientX, y: e.clientY, t: now };

    wrap.querySelectorAll<HTMLElement>("[data-tilt-char]").forEach((char) => {
      const r = char.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 320);
      gsap.to(char, {
        rotateY: clamp(dx * 0.4 + vx * 260, -85, 85) * influence,
        rotateX: clamp(-dy * 0.55 - vy * 260, -85, 85) * influence,
        rotateZ: clamp((vx - vy) * 60, -40, 40) * influence,
        transformPerspective: 500,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const onLeave = () => {
    last.current = null;
    if (!wrapRef.current) return;
    gsap.to(wrapRef.current.querySelectorAll("[data-tilt-char]"), {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.35)",
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block cursor-default"
      style={{ perspective: 600 }}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-tilt-char
          className="inline-block will-change-transform"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero-portrait]",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "expo.out" }
      ).fromTo(
        "[data-hero-kicker]",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.6"
      ).fromTo(
        "[data-hero-name]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
        "-=0.4"
      );

      // Per-character headline reveal, woven into the same master timeline.
      if (headlineRef.current) {
        let played = false;
        SplitText.create(headlineRef.current, {
          type: "lines, chars",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            // autoSplit reverts whatever animation onSplit returns each time
            // it re-splits (resize across a line-wrap, late font load), so
            // this must return a self-contained chars tween — returning the
            // master `tl` would tear down the entire hero intro on resize.
            if (!played) {
              played = true;
              const reveal = gsap.from(self.chars, {
                yPercent: 115,
                opacity: 0,
                rotateZ: 4,
                duration: 0.9,
                stagger: 0.018,
                ease: "power4.out",
              });
              tl.add(reveal, "-=0.3");
              return reveal;
            }
            // Re-splits after the intro already played: keep the headline
            // visible instead of replaying it mid-session.
            return gsap.set(self.chars, { yPercent: 0, opacity: 1, rotateZ: 0 });
          },
        });
      }

      tl.fromTo(
        "[data-hero-sub]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      ).fromTo(
        "[data-hero-cta] > *",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        "-=0.4"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-28 pt-28 sm:px-8 lg:px-16"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-[0.18]" />
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/[0.07] blur-[120px]" />
        <HeroScene />
      </div>

      <div className="container-x flex flex-col items-center gap-12 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left">
        {/* Copy */}
        <div className="flex max-w-3xl flex-col items-center lg:items-start">
          {/* Kicker */}
          <p
            data-hero-kicker
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45"
          >
            <span>Software Developer</span>
            <span className="h-3 w-px bg-white/20" />
            <span>{site.location}</span>
          </p>

          {/* Name */}
          <div data-hero-name className="mt-5 flex w-full flex-col items-center lg:items-start">
            <p
              className="text-[clamp(2.75rem,7vw,5rem)] font-bold leading-none text-white"
              style={{ fontFamily: "var(--font-name)" }}
            >
              <TiltName text="Salimu" />
            </p>
            <DotMatrixText
              text="KABOGERE"
              className="mt-4 w-full max-w-[640px]"
            />
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="mt-6 text-balance text-[1.9rem] font-extralight leading-[1.12] tracking-tight text-white/90 sm:text-4xl lg:text-5xl"
          >
            I build software for the{" "}
            <span className="text-brand-primary">web</span>,{" "}
            <span className="text-brand-primary">cloud</span> and{" "}
            <span className="text-brand-primary">Hand-Helds</span>.
          </h1>

          {/* Subtitle */}
          <p
            data-hero-sub
            className="mt-7 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base"
          >
            Backend services and clean interfaces, built to run reliably in
            production — with a growing curiosity for cybersecurity and AI / ML.
          </p>

          {/* CTAs */}
          <div
            data-hero-cta
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link href="/projects" className="btn-frame group">
              View projects
              <ArrowRight className="h-4 w-4" />
              <Corners />
            </Link>
            <Link href="/contact" className="btn-frame group">
              Get in touch
              <Corners />
            </Link>
            <a href={site.cvUrl} download className="btn-frame group">
              Download CV
              <Corners />
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div data-hero-portrait className="group relative shrink-0">
          {/* Orbiting "OPEN TO WORK" label ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 animate-[spin_18s_linear_infinite] sm:-inset-10"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path
                  id="portrait-orbit"
                  d="M 50,50 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                  fill="none"
                />
              </defs>
              <text
                className="font-mono uppercase"
                fill="rgba(255,255,255,0.5)"
                fontSize="5"
                letterSpacing="2.6"
              >
                <textPath href="#portrait-orbit">
                  Open to work · Open to work · Open to work ·
                </textPath>
              </text>
            </svg>
          </div>

          {/* Slowly revolving photo; hover turns it yellow and blurs it */}
          <div className="relative h-40 w-40 animate-[spin_32s_linear_infinite] overflow-hidden rounded-full border border-white/10 ring-soft sm:h-52 sm:w-52 lg:h-72 lg:w-72">
            <Image
              src="/profile.png"
              alt={site.name}
              fill
              priority
              sizes="(min-width: 1024px) 288px, (min-width: 640px) 208px, 160px"
              className="object-cover transition-[filter] duration-500 group-hover:[filter:sepia(1)_saturate(4)_hue-rotate(15deg)_brightness(1.1)_blur(3px)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
