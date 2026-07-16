"use client";

import { useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Barba-style SPA transitions for the Next.js App Router: a full-screen
 * curtain wipes up to cover the outgoing page, the route swaps underneath
 * it (Next has already prefetched the RSC payload via <Link>, so this is
 * instant), then the curtain wipes away to reveal the new page. Persistent
 * chrome (Navbar/Footer/StatusBar) lives outside this component and never
 * unmounts, only the routed `children` container transitions.
 *
 * Interrupted navigations are first-class: a new navigation kills whatever
 * timeline is in flight and tweens from the curtain's current position, and
 * navigating back to the still-displayed route mid-transition (fast A→B→A)
 * unwinds the curtain instead of leaving it frozen over the page.
 */
export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  // What's actually on screen. Deliberately lags `pathname`: the swap happens
  // only once the curtain fully covers the old page.
  const [display, setDisplay] = useState({ children, pathname });

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeTl = useRef<gsap.core.Timeline | null>(null);
  const hasMounted = useRef(false);

  // INIT — the overlay starts hidden via `opacity-0` (a plain, non-transform
  // class so there's a sane pre-hydration paint with no JS). The very first
  // time GSAP touches an element it parses whatever transform is already on
  // it into its own x/y cache — if that had been a CSS `translate-y-full`,
  // every later `yPercent` set would stack additively on top of that stale
  // baseline instead of replacing it, and the curtain would drift further
  // off-target (and never fully hide/reveal) with each transition. Setting
  // the real transform here, once, on an element with no prior transform
  // keeps GSAP's cache clean from the start.
  useIsomorphicLayoutEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 100, opacity: 1 });
    }
  }, []);

  // LEAVE — fires the instant the route changes; covers the screen, then
  // swaps in the new route's content while fully hidden behind the curtain.
  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (pathname === display.pathname) {
      // The route snapped back to what's already displayed (fast A→B→A)
      // while a leave was mid-flight. The interrupted timeline was killed by
      // its own effect cleanup, freezing the curtain wherever it was — so
      // unwind it back down and restore the content instead of leaving the
      // page half-covered with nothing scheduled to repair it.
      if (activeTl.current) {
        activeTl.current.kill();
        const tl = gsap.timeline({
          onComplete: () => {
            activeTl.current = null;
            gsap.set(overlay, { pointerEvents: "none" });
          },
        });
        activeTl.current = tl;
        tl.to(labelRef.current, { opacity: 0, duration: 0.15 })
          .to(overlay, { yPercent: 100, duration: 0.4, ease: "power3.inOut" }, "<")
          .to(content, { opacity: 1, y: 0, duration: 0.3 }, "<");
      }
      return;
    }

    // Kill any in-flight timeline; the tweens below start from the curtain's
    // current position, so an interrupted transition re-targets smoothly.
    activeTl.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.current = null;
        setDisplay({ children, pathname });
      },
    });
    activeTl.current = tl;

    tl.set(overlay, { pointerEvents: "auto" })
      .to(overlay, { yPercent: 0, duration: 0.5, ease: "power4.inOut" })
      .to(content, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" }, "<")
      .to(labelRef.current, { opacity: 1, duration: 0.2 }, "-=0.15");

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ENTER — fires right after the swapped content has mounted underneath
  // the curtain; reveals it by wiping the curtain away.
  useIsomorphicLayoutEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // skip on first paint — nothing to reveal, page is already there
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    window.scrollTo({ top: 0 });

    activeTl.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.current = null;
        gsap.set(overlay, { pointerEvents: "none" });
        // The new page's DOM is now fully revealed and settled — recompute
        // ScrollTrigger positions against it (ScrollManager's pathname-keyed
        // refresh fired earlier, against the outgoing page's DOM).
        ScrollTrigger.refresh();
      },
    });
    activeTl.current = tl;

    tl.set(content, { opacity: 0, y: 16 })
      .to(labelRef.current, { opacity: 0, duration: 0.2 })
      .to(overlay, { yPercent: -100, duration: 0.55, ease: "power4.inOut" }, "+=0.05")
      .to(content, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.35")
      .set(overlay, { yPercent: 100 });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display.pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        data-page-curtain
        className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-surface-ink opacity-0"
      >
        <span
          ref={labelRef}
          className="hud-label flex items-center gap-3 opacity-0"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary" />
          Loading
        </span>
      </div>
      <div ref={contentRef}>{display.children}</div>
    </>
  );
}
