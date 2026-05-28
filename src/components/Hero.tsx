"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { site } from "@/data/site";
import Corners from "./Corners";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-portrait]",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "expo.out" }
      )
        .fromTo(
          "[data-hero-kicker]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-headline] .line",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta] > *",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        );

      // Scroll-linked fade/scale as the next section rises over the pinned hero
      gsap.to("[data-hero-fade]", {
        opacity: 0.2,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden px-5 pb-28 pt-28 sm:px-8 lg:px-16"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-[0.18]" />
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/[0.07] blur-[120px]" />
      </div>

      <div
        data-hero-fade
        className="container-x flex flex-col items-center text-center"
      >
        {/* Portrait */}
        <div
          data-hero-portrait
          className="relative mb-8 h-24 w-24 overflow-hidden rounded-full border border-white/10 ring-soft sm:h-28 sm:w-28"
        >
          <Image
            src="/profile.png"
            alt={site.name}
            fill
            priority
            sizes="112px"
            className="object-cover"
          />
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
          data-hero-headline
          className="max-w-4xl text-balance text-[2.35rem] font-extralight leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          <span className="block overflow-hidden">
            <span className="line block">I build software for the</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line block">
              <span className="text-brand-primary">web</span>,{" "}
              <span className="text-brand-primary">cloud</span> and{" "}
              <span className="text-brand-primary">control</span>.
            </span>
          </span>
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
