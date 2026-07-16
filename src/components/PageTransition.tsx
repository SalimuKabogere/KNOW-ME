"use client";

import { useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HIDDEN = "circle(0% at 50% 50%)";
const COVERED = "circle(75% at 50% 50%)";

/**
 * Ripple-dive SPA transitions for the Next.js App Router: a circular ripple
 * expands from the center of the screen and swallows the outgoing page (the
 * content zooms toward the viewer, as if running into the ripple) while
 * concentric rings rush outward like a tunnel. The route swaps underneath,
 * then the ripple bursts — spilling bubbles across the screen — and the new
 * page is revealed. Persistent chrome (Navbar/Footer/StatusBar) lives outside
 * this component and never unmounts, only the routed `children` container
 * transitions.
 *
 * Interrupted navigations are first-class: a new navigation kills whatever
 * timeline is in flight and tweens from the ripple's current radius, and
 * navigating back to the still-displayed route mid-transition (fast A→B→A)
 * shrinks the ripple away instead of leaving it frozen over the page.
 */
export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  // What's actually on screen. Deliberately lags `pathname`: the swap happens
  // only once the ripple fully covers the old page.
  const [display, setDisplay] = useState({ children, pathname });

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bubbleLayerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeTl = useRef<gsap.core.Timeline | null>(null);
  const ringsTween = useRef<gsap.core.Tween | null>(null);
  const hasMounted = useRef(false);

  // Endless ring tunnel while the ripple covers the screen: rings scale up
  // from the center and accelerate toward the viewer.
  const startRings = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    ringsTween.current?.kill();
    ringsTween.current = gsap.fromTo(
      overlay.querySelectorAll("[data-ripple-ring]"),
      { scale: 0.05, opacity: 0.9 },
      {
        scale: 2.8,
        opacity: 0,
        duration: 1.3,
        ease: "power2.in",
        stagger: { each: 0.32, repeat: -1 },
      }
    );
  };

  const stopRings = () => {
    ringsTween.current?.kill();
    ringsTween.current = null;
  };

  // The burst: bubbles spill outward from the center of the popping ripple.
  const spawnBubbles = () => {
    const layer = bubbleLayerRef.current;
    if (!layer) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const reach = Math.hypot(window.innerWidth, window.innerHeight) / 2;

    for (let i = 0; i < 28; i++) {
      const el = document.createElement("span");
      const size = 8 + Math.random() * 46;
      el.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;border-radius:9999px;will-change:transform,opacity;`;
      if (Math.random() < 0.45) {
        el.style.background = "rgba(121, 178, 218, 0.35)";
      } else {
        el.style.border = "1.5px solid rgba(232, 236, 239, 0.55)";
      }
      layer.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const dist = (0.3 + Math.random() * 0.6) * reach;
      gsap.fromTo(
        el,
        { scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0.7 + Math.random() * 0.8,
          opacity: 0,
          duration: 0.65 + Math.random() * 0.55,
          ease: "power2.out",
          onComplete: () => el.remove(),
        }
      );
    }
  };

  // INIT — the overlay starts hidden via `opacity-0` (a plain class so
  // there's a sane pre-hydration paint with no JS); swap that for the real
  // hidden state, a zero-radius ripple, once GSAP is in charge.
  useIsomorphicLayoutEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { clipPath: HIDDEN, opacity: 1 });
    }
    return () => stopRings();
  }, []);

  // LEAVE — fires the instant the route changes; the ripple swallows the
  // screen, then the new route's content swaps in while fully hidden.
  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (pathname === display.pathname) {
      // The route snapped back to what's already displayed (fast A→B→A)
      // while a leave was mid-flight. The interrupted timeline was killed by
      // its own effect cleanup, freezing the ripple wherever it was — so
      // shrink it away and restore the content instead of leaving the page
      // half-covered with nothing scheduled to repair it.
      if (activeTl.current) {
        activeTl.current.kill();
        const tl = gsap.timeline({
          onComplete: () => {
            activeTl.current = null;
            stopRings();
            gsap.set(overlay, { pointerEvents: "none" });
          },
        });
        activeTl.current = tl;
        tl.to(labelRef.current, { opacity: 0, duration: 0.15 })
          .to(overlay, { clipPath: HIDDEN, duration: 0.4, ease: "power3.inOut" }, "<")
          .to(content, { opacity: 1, scale: 1, duration: 0.3 }, "<")
          // Leaving a transform on the content wrapper would make it the
          // containing block for any `position: fixed` inside the page
          // (e.g. the landing page's scroll-riding 3D scene) — clear it.
          .set(content, { clearProps: "transform" });
      }
      return;
    }

    // Kill any in-flight timeline; the tweens below start from the ripple's
    // current radius, so an interrupted transition re-targets smoothly.
    activeTl.current?.kill();
    startRings();

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.current = null;
        setDisplay({ children, pathname });
      },
    });
    activeTl.current = tl;

    // The outgoing page zooms toward the viewer — running into the ripple.
    tl.set(overlay, { pointerEvents: "auto" })
      .to(overlay, { clipPath: COVERED, duration: 0.55, ease: "power4.in" })
      .to(content, { opacity: 0, scale: 1.1, duration: 0.5, ease: "power2.in" }, "<")
      .to(labelRef.current, { opacity: 1, duration: 0.2 }, "-=0.15");

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ENTER — fires right after the swapped content has mounted underneath
  // the ripple; pops it, spills the bubbles, and reveals the new page.
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
        stopRings();
        gsap.set(overlay, { pointerEvents: "none" });
        // The new page's DOM is now fully revealed and settled — recompute
        // ScrollTrigger positions against it (ScrollManager's pathname-keyed
        // refresh fired earlier, against the outgoing page's DOM).
        ScrollTrigger.refresh();
      },
    });
    activeTl.current = tl;

    tl.set(content, { opacity: 0, scale: 0.94 })
      .to(labelRef.current, { opacity: 0, duration: 0.2 })
      .add(spawnBubbles, "+=0.05")
      .to(
        overlay,
        { clipPath: HIDDEN, duration: 0.5, ease: "power3.inOut" },
        "<"
      )
      .to(content, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, "-=0.3")
      // Leaving a transform on the content wrapper would make it the
      // containing block for any `position: fixed` inside the page
      // (e.g. the landing page's scroll-riding 3D scene) — clear it.
      .set(content, { clearProps: "transform" });

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
        {/* Ripple tunnel rings */}
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            data-ripple-ring
            className="absolute h-[46vmax] w-[46vmax] rounded-full border-2 border-brand-primary/35"
          />
        ))}
        <span
          ref={labelRef}
          className="hud-label flex items-center gap-3 opacity-0"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary" />
          Loading
        </span>
      </div>
      {/* Bubble burst layer — above the overlay so the spill isn't clipped
          by the shrinking ripple */}
      <div
        ref={bubbleLayerRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[101]"
      />
      <div ref={contentRef}>{display.children}</div>
    </>
  );
}
