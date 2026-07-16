"use client";

import { useEffect, useRef, type ElementRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// Corner waypoints (as fractions of the visible half-extents) the blob
// glides through as the page scrolls: center → top-right → bottom-left →
// top-left → bottom-right.
const PATH: [number, number][] = [
  [0, 0],
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];

// Brand palette stops the blob cycles through as it travels — kept to the
// brighter end of the project blues so the wireframe stays luminous but
// translucent instead of muddying the content behind it.
const COLOR_STOPS = [
  new THREE.Color("#79B2DA"), // brand primary
  new THREE.Color("#A9CDE9"), // light tint of primary
  new THREE.Color("#5C98C2"), // brand medium
  new THREE.Color("#8FC1E5"), // back toward primary for the footer
];

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<ElementRef<typeof MeshDistortMaterial>>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);

  // The canvas sits behind the hero copy with pointer-events: none, so r3f's
  // built-in `state.pointer` never updates (its listeners live on the canvas
  // element, which can't receive events) — track the pointer at the window
  // level instead.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;

    // Overall page scroll progress (0 at top, 1 at the very bottom) drives
    // the blob along the corner-to-corner PATH and spins it faster.
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const p = Math.min(window.scrollY / maxScroll, 1);

    m.rotation.y += delta * (0.15 + p * 2.2);
    m.rotation.x = THREE.MathUtils.lerp(
      m.rotation.x,
      pointer.current.y * 0.3 + p * 1.4,
      0.06
    );
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, pointer.current.x * 0.15, 0.04);

    // Visible half-extents at the blob's plane, inset so it never fully
    // leaves the frame.
    const hx = Math.max(viewport.width / 2 - 1.4, 0.4);
    const hy = Math.max(viewport.height / 2 - 1.0, 0.3);
    const segs = PATH.length - 1;
    const seg = Math.min(Math.floor(p * segs), segs - 1);
    let t = p * segs - seg;
    t = t * t * (3 - 2 * t); // smoothstep between corners
    const tx = (PATH[seg][0] + (PATH[seg + 1][0] - PATH[seg][0]) * t) * hx;
    const ty = (PATH[seg][1] + (PATH[seg + 1][1] - PATH[seg][1]) * t) * hy;
    m.position.x = THREE.MathUtils.lerp(m.position.x, tx, 0.08);
    m.position.y = THREE.MathUtils.lerp(m.position.y, ty, 0.08);

    const s = 1 + p * 0.35;
    m.scale.set(s, s, s);

    // Glide through the brand palette as the blob travels the page.
    if (material.current) {
      const cSegs = COLOR_STOPS.length - 1;
      const ci = Math.min(Math.floor(p * cSegs), cSegs - 1);
      material.current.color.lerpColors(
        COLOR_STOPS[ci],
        COLOR_STOPS[ci + 1],
        p * cSegs - ci
      );
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 10]} />
        <MeshDistortMaterial
          ref={material}
          color="#79B2DA"
          distort={0.38}
          speed={1.6}
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

/**
 * Decorative wireframe blob pinned to the viewport behind the landing
 * page's content — faint and translucent so it reads as ambient texture,
 * not a competing focal point. It rides the page scroll from corner to
 * corner (see PATH). Client-only (dynamic-imported with ssr:false by the
 * caller) since it touches the canvas/GPU. Never mounts under
 * prefers-reduced-motion.
 */
export default function HeroScene() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className="fixed inset-0 opacity-45">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#79B2DA" />
        <pointLight position={[-4, -3, -2]} intensity={0.7} color="#5C98C2" />
        <Blob />
        <Sparkles count={70} scale={6.5} size={2} speed={0.3} color="#79B2DA" opacity={0.35} />
      </Canvas>
    </div>
  );
}
