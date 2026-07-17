"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { navLinks, site } from "@/data/site";
import logo from "@/assets/LOMA.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Scroll-spy state: the section currently in view, and the furthest
  // section ever reached (nodes stay lit once you've been there).
  const [active, setActive] = useState(0);
  const [reachedMax, setReachedMax] = useState(0);

  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const nodeRefs = useRef<(SVGSVGElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<SVGRectElement>(null);
  const cometRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SCROLL SPY — one trigger per nav section. Activating a node for the
  // first time fires an expanding diamond burst on it.
  useEffect(() => {
    const reachedRef = { current: 0 };
    const triggers: ScrollTrigger[] = [];

    navLinks.forEach((link, i) => {
      const id = link.href.replace("#", "");
      if (!document.getElementById(id)) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle(self) {
            if (!self.isActive) return;
            setActive(i);
            if (i > reachedRef.current) {
              reachedRef.current = i;
              setReachedMax(i);
              const burst = nodeRefs.current[i]?.querySelector("[data-node-burst]");
              if (burst) {
                gsap.fromTo(
                  burst,
                  { scale: 0.5, opacity: 0.9, transformOrigin: "50% 50%" },
                  { scale: 2.6, opacity: 0, duration: 0.8, ease: "power2.out" }
                );
              }
            }
          },
        })
      );
    });

    // PROGRESS HAIRLINE — gradient bar + glowing comet riding page progress.
    const bar = barRef.current;
    const comet = cometRef.current;
    let progressTrigger: ScrollTrigger | undefined;
    if (bar && comet) {
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      const barTo = gsap.quickTo(bar, "scaleX", { duration: 0.35, ease: "power3" });
      const cometTo = gsap.quickTo(comet, "x", { duration: 0.35, ease: "power3" });
      progressTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          barTo(self.progress);
          cometTo(self.progress * (window.innerWidth - 8));
        },
      });
    }

    return () => {
      triggers.forEach((t) => t.kill());
      progressTrigger?.kill();
    };
  }, []);

  // MAGIC UNDERLINE — glides to the active link.
  useEffect(() => {
    const move = (instant = false) => {
      const el = linkRefs.current[active];
      const underline = underlineRef.current;
      if (!el || !underline) return;
      const vars = { left: el.offsetLeft, width: el.offsetWidth };
      if (instant) gsap.set(underline, vars);
      else gsap.to(underline, { ...vars, duration: 0.6, ease: "back.out(1.8)", overwrite: "auto" });
    };
    move();
    const onResize = () => move(true);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => move(true));
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const diamond = "M6 1.4 L10.6 6 L6 10.6 L1.4 6 Z";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between px-5 py-3.5 sm:px-8 lg:px-16">
        {/* Logo + identity */}
        <Link href="/" className="group flex items-center gap-3" aria-label="Go to home">
          <img src={logo.src} alt="LOMA" className="logo-image" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-medium tracking-[0.05em] text-white">
              {site.name}
            </span>
            <span className="hud-label">Software Developer</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul ref={listRef} className="relative hidden items-center gap-7 md:flex">
          {navLinks.map((link, i) => {
            const isCurrent = i === active;
            const reached = i <= reachedMax;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isCurrent ? "text-white" : "text-white/45 hover:text-white"
                  }`}
                >
                  {/* Section node: hollow → filled once reached; the current
                      one slowly spins; a burst ring fires on first arrival */}
                  <svg
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    viewBox="0 0 12 12"
                    aria-hidden
                    className={`h-2 w-2 shrink-0 overflow-visible ${
                      isCurrent ? "anim-spin-slow" : ""
                    }`}
                  >
                    <path
                      d={diamond}
                      strokeWidth="1.2"
                      className={`transition-all duration-500 ${
                        reached
                          ? "fill-brand-primary/80 stroke-brand-primary"
                          : "fill-transparent stroke-white/30"
                      }`}
                    />
                    <path
                      data-node-burst
                      d={diamond}
                      fill="none"
                      stroke="#79B2DA"
                      strokeWidth="1"
                      opacity="0"
                    />
                  </svg>
                  {link.label}
                </a>
              </li>
            );
          })}
          {/* Magic underline */}
          <span
            ref={underlineRef}
            aria-hidden
            className="pointer-events-none absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-brand-medium to-brand-primary shadow-[0_0_8px_1px_rgba(121,178,218,0.55)]"
          />
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/12 text-white/60 transition-colors hover:border-brand-primary/50 hover:text-white sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/12 text-white/60 transition-colors hover:border-brand-primary/50 hover:text-white sm:inline-flex"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="hidden rounded-full border border-white/16 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-brand-primary/60 hover:bg-brand-primary/10 sm:inline-flex"
          >
            Get in touch
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/12 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Scroll-progress hairline along the header's bottom edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg
          className="block h-[2px] w-full"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="nav-progress-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#306C93" />
              <stop offset="0.55" stopColor="#5C98C2" />
              <stop offset="1" stopColor="#79B2DA" />
            </linearGradient>
          </defs>
          <rect width="100" height="2" fill="rgba(255,255,255,0.06)" />
          <rect ref={barRef} width="100" height="2" fill="url(#nav-progress-grad)" />
        </svg>
        {/* Comet head */}
        <span
          ref={cometRef}
          className="absolute -top-[3px] left-0 h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_12px_3px_rgba(121,178,218,0.75)]"
        />
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="container-x flex flex-col px-5 py-3">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-2 border-b border-white/5 px-1 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  i === active ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                <svg viewBox="0 0 12 12" aria-hidden className="h-2 w-2 shrink-0">
                  <path
                    d={diamond}
                    strokeWidth="1.2"
                    className={
                      i <= reachedMax
                        ? "fill-brand-primary/80 stroke-brand-primary"
                        : "fill-transparent stroke-white/30"
                    }
                  />
                </svg>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
