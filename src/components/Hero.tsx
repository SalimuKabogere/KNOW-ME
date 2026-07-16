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

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

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

      <div className="container-x flex flex-col items-center text-center">
        {/* Portrait with rotating "open to work" badge ring */}
        <div
          data-hero-portrait
          className="group relative mb-8 h-40 w-40 sm:h-44 sm:w-44"
        >
          <svg
            viewBox="0 0 176 176"
            aria-hidden
            className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
          >
            <defs>
              <path
                id="hero-badge-orbit"
                d="M 88,88 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                fill="none"
              />
            </defs>
            <text className="fill-white/40 font-mono text-[10.5px] uppercase tracking-[0.32em] transition-colors duration-500 group-hover:fill-[#E6C079]">
              <textPath href="#hero-badge-orbit">
                Open to work · Open to work · Open to work ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 m-auto h-24 w-24 overflow-hidden rounded-full border border-white/10 ring-soft transition-colors duration-500 group-hover:border-[#E6C079]/70 sm:h-28 sm:w-28">
            <Image
              src="/profile.png"
              alt={site.name}
              fill
              priority
              sizes="112px"
              className="object-cover transition-[filter] duration-500 ease-out group-hover:[filter:sepia(0.85)_saturate(1.35)_hue-rotate(-12deg)_brightness(0.98)]"
            />
          </div>
        </div>

        {/* Kicker */}
        <p
          data-hero-kicker
          className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45"
        >
          <span className="text-white/70">{site.name}</span>
          <span className="h-3 w-px bg-white/20" />
          <span>Software Developer</span>
        </p>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="max-w-4xl text-balance text-[2.35rem] font-extralight leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          I build software for the{" "}
          <span className="text-brand-primary">web</span>,{" "}
          <span className="text-brand-primary">cloud</span> and{" "}
          <span className="text-brand-primary">control</span>.
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
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
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
    </section>
  );
}
