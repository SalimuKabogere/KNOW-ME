"use client";

import { useEffect, useRef } from "react";

const BASE = "#E8ECEF";
const DIM = "rgba(232, 236, 239, 0.4)";
const ACCENT = "#79B2DA";

// Rasterize at this many pixels per grid cell, then average — a single
// sample per cell aliases thin strokes away and the letterforms turn mushy.
const SUPERSAMPLE = 3;

// Deterministic per-cell hash so the accent/dim dots keep their positions
// across redraws instead of reshuffling on every resize.
function cellHash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

type Dot = {
  ox: number; // rest position
  oy: number;
  x: number; // spring offset from rest
  y: number;
  vx: number;
  vy: number;
  color: string;
};

/**
 * Renders text as an LED/dot-matrix grid: the text is rasterized offscreen,
 * downsampled to one cell per dot, and each lit cell becomes a small square,
 * with a scattering of brand-colored and dimmed dots for texture.
 *
 * On hover the grid behaves like a piece of cloth in wind: a traveling wave
 * undulates through the dots, and the cursor pushes ripples through them
 * that spring back into place.
 */
export default function DotMatrixText({
  text,
  className = "",
  pitch = 6,
  fontVar = "--font-sans",
}: {
  text: string;
  className?: string;
  /** Grid spacing in CSS px between dot centers. */
  pitch?: number;
  /** CSS variable holding the font-family to rasterize with. */
  fontVar?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let effPitch = pitch;
    let dotSize = pitch * 0.5;

    let raf = 0;
    let running = false;
    let t = 0;
    let windAmp = 0; // 0..1, ramps in on hover, out on leave
    let windTarget = 0;
    let windDir = { x: 1, y: 0.12 };
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0, has: false };

    const build = () => {
      const w = wrap.clientWidth;
      if (!w) return;

      const family =
        getComputedStyle(wrap).getPropertyValue(fontVar).trim() ||
        "sans-serif";

      // Measure at a reference size to get the text's aspect ratio. No
      // tracking: the glyphs sit tight so the grid reads as one cloth.
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;
      probe.font = `800 100px ${family}`;
      const metrics = probe.measureText(text);
      const textW = metrics.width || 1;
      const ascent = metrics.actualBoundingBoxAscent || 74;
      const descent = metrics.actualBoundingBoxDescent || 4;
      const textH = ascent + descent;

      // Shrink the pitch on narrow containers so there are always enough
      // cells per glyph to keep the letterforms readable.
      effPitch = Math.max(4, Math.min(pitch, w / 96));
      dotSize = effPitch * 0.5;
      const cols = Math.max(1, Math.floor(w / effPitch));
      const rows = Math.max(1, Math.round((cols * textH) / textW));
      width = w;
      height = rows * effPitch;

      // Rasterize the glyphs at SUPERSAMPLE pixels per grid cell.
      const off = document.createElement("canvas");
      off.width = cols * SUPERSAMPLE;
      off.height = rows * SUPERSAMPLE;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      const fontSize = (100 * cols * SUPERSAMPLE) / textW;
      offCtx.font = `800 ${fontSize}px ${family}`;
      offCtx.textBaseline = "alphabetic";
      offCtx.fillStyle = "#fff";
      offCtx.fillText(text, 0, (ascent * cols * SUPERSAMPLE) / textW);
      const pixels = offCtx.getImageData(0, 0, off.width, off.height).data;

      dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Average alpha over the cell's supersampled block.
          let sum = 0;
          for (let sy = 0; sy < SUPERSAMPLE; sy++) {
            const rowStart =
              ((y * SUPERSAMPLE + sy) * off.width + x * SUPERSAMPLE) * 4;
            for (let sx = 0; sx < SUPERSAMPLE; sx++) {
              sum += pixels[rowStart + sx * 4 + 3];
            }
          }
          if (sum / (SUPERSAMPLE * SUPERSAMPLE) < 110) continue;

          const r = cellHash(x, y);
          dots.push({
            ox: (x + 0.5) * effPitch,
            oy: (y + 0.5) * effPitch,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            color: r < 0.07 ? ACCENT : r > 0.88 ? DIM : BASE,
          });
        }
      }
      // Group by color so render passes switch fillStyle only twice.
      dots.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const half = dotSize / 2;
      let fill = "";
      for (const d of dots) {
        if (d.color !== fill) {
          fill = d.color;
          ctx.fillStyle = fill;
        }
        // Traveling cloth wave, applied at render time on top of the
        // spring offsets so it costs nothing when windAmp is 0.
        let dx = d.x;
        let dy = d.y;
        if (windAmp > 0.001) {
          const sway =
            Math.sin(d.ox * 0.02 - t * 3.0 + d.oy * 0.014) +
            0.5 * Math.sin(d.ox * 0.043 - t * 4.4);
          dx +=
            windAmp *
            effPitch *
            (0.8 * Math.sin(d.oy * 0.06 + t * 2.3) + 0.6 * sway * windDir.x);
          dy += windAmp * effPitch * (1.5 * sway + 0.5 * windDir.y * sway);
        }
        ctx.fillRect(d.ox + dx - half, d.oy + dy - half, dotSize, dotSize);
      }
    };

    const step = () => {
      t += 1 / 60;
      windAmp += (windTarget - windAmp) * 0.05;

      let energy = windAmp;
      for (const d of dots) {
        // Spring back toward rest with damping.
        d.vx += -d.x * 0.06;
        d.vy += -d.y * 0.06;
        d.vx *= 0.88;
        d.vy *= 0.88;
        d.x += d.vx;
        d.y += d.vy;
        energy += Math.abs(d.vx) + Math.abs(d.vy);
      }

      render();

      if (energy < 0.01 && windTarget === 0) {
        running = false;
        // Settle exactly at rest for the final static frame.
        for (const d of dots) {
          d.x = d.y = d.vx = d.vy = 0;
        }
        windAmp = 0;
        render();
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const onEnter = (e: PointerEvent) => {
      windTarget = 1;
      pointer.has = false;
      onMove(e);
      wake();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const now = performance.now();

      if (pointer.has) {
        const dt = Math.max(now - pointer.t, 8);
        pointer.vx = (px - pointer.x) / dt;
        pointer.vy = (py - pointer.y) / dt;
        const speed = Math.hypot(pointer.vx, pointer.vy);
        if (speed > 0.05) {
          // The cursor's direction becomes the wind direction.
          windDir = { x: pointer.vx / speed, y: pointer.vy / speed };
        }
      }
      pointer.x = px;
      pointer.y = py;
      pointer.t = now;
      pointer.has = true;

      // Ripple: push nearby dots away from the cursor and along its motion.
      const R = effPitch * 16;
      for (const d of dots) {
        const dx = d.ox + d.x - px;
        const dy = d.oy + d.y - py;
        if (Math.abs(dx) > R || Math.abs(dy) > R) continue;
        const dist = Math.hypot(dx, dy);
        if (dist > R) continue;
        const f = (1 - dist / R) ** 2;
        const inv = dist > 0.001 ? 1 / dist : 0;
        d.vx += dx * inv * f * 2.6 + pointer.vx * f * 5;
        d.vy += dy * inv * f * 2.6 + pointer.vy * f * 5;
      }
      wake();
    };

    const onLeave = () => {
      windTarget = 0;
      pointer.has = false;
      wake();
    };

    document.fonts.ready.then(build);
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    if (!reduced) {
      wrap.addEventListener("pointerenter", onEnter);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [text, pitch, fontVar]);

  return (
    <div ref={wrapRef} className={className} role="img" aria-label={text}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
