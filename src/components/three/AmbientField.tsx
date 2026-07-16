"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

function Network({ count = 46, radius = 4.4 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);

  const { points, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = Array.from({ length: count }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      )
    );

    const lines: number[] = [];
    const maxDist = radius * 0.55;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    return {
      points: new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])),
      linePositions: new Float32Array(lines),
    };
  }, [count, radius]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.025;
    g.rotation.x += delta * 0.008;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#5C98C2" transparent opacity={0.18} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#79B2DA"
          size={0.055}
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/**
 * A slow-drifting particle constellation fixed behind the whole app shell —
 * it lives in the root layout (not per-page), so it never unmounts across
 * route changes. That persistence is deliberate: it reads as one continuous
 * app, not a stack of reloaded documents. Never mounts under
 * prefers-reduced-motion.
 */
export default function AmbientField() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
      {/* dpr locked to 1 and no antialiasing: this canvas runs for the whole
          session behind everything at 50% opacity — faint dots and hairlines
          don't earn a retina-resolution render pass. */}
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
      >
        <Network />
      </Canvas>
    </div>
  );
}
