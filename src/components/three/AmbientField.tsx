"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const BLUE_LINE = new THREE.Color("#5C98C2");
const BLUE_POINT = new THREE.Color("#79B2DA");
// "Low yellow" — the same muted amber the portrait ring uses on hover.
const AMBER_LINE = new THREE.Color("#C2A25C");
const AMBER_POINT = new THREE.Color("#E6C079");

type Ripple = { center: THREE.Vector3; start: number };

const _v = new THREE.Vector3();
const _plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();

function Network({ count = 72, radius = 6.4 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const pointsGeo = useRef<THREE.BufferGeometry>(null);
  const linesGeo = useRef<THREE.BufferGeometry>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);

  const heat = useRef(0); // 0 = resting blue, 1 = amber
  const clickFlash = useRef(0);
  const lastMove = useRef(0);
  const ripples = useRef<Ripple[]>([]);
  const camera = useThree((s) => s.camera);

  const { basePositions, pairs, pointArray, lineArray } = useMemo(() => {
    const pts: THREE.Vector3[] = Array.from({ length: count }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      )
    );

    const pairs: Array<[number, number]> = [];
    const maxDistSq = (radius * 0.45) ** 2;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceToSquared(pts[j]) < maxDistSq) pairs.push([i, j]);
      }
    }

    const pointArray = new Float32Array(count * 3);
    pts.forEach((p, i) => p.toArray(pointArray, i * 3));
    const lineArray = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], k) => {
      pts[a].toArray(lineArray, k * 6);
      pts[b].toArray(lineArray, k * 6 + 3);
    });

    return { basePositions: pts, pairs, pointArray, lineArray };
  }, [count, radius]);

  // The canvas is pointer-events-none behind the whole app, so interaction
  // arrives via window-level listeners: any pointer movement warms the net
  // toward amber, and clicks drop a ripple at the click point (unprojected
  // onto the z=0 plane, then into the rotating group's local space).
  useEffect(() => {
    const onMove = () => {
      lastMove.current = performance.now();
    };
    const onClick = (e: MouseEvent) => {
      const g = group.current;
      if (!g) return;
      _ndc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      _ray.setFromCamera(_ndc, camera);
      const hit = new THREE.Vector3();
      if (_ray.ray.intersectPlane(_plane, hit)) {
        ripples.current.push({ center: g.worldToLocal(hit), start: performance.now() });
        if (ripples.current.length > 4) ripples.current.shift();
        clickFlash.current = 1;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.02;
    g.rotation.x += delta * 0.007;

    // Warm toward amber while the pointer is moving, cool back when idle;
    // clicks flash it hot instantly and decay.
    const now = performance.now();
    const active = now - lastMove.current < 400;
    heat.current = THREE.MathUtils.lerp(heat.current, active ? 1 : 0, active ? 0.055 : 0.02);
    clickFlash.current = Math.max(0, clickFlash.current - delta * 0.9);
    const mix = Math.min(1, heat.current + clickFlash.current);

    if (linesMat.current && pointsMat.current) {
      linesMat.current.color.copy(BLUE_LINE).lerp(AMBER_LINE, mix);
      pointsMat.current.color.copy(BLUE_POINT).lerp(AMBER_POINT, mix);
      linesMat.current.opacity = 0.2 + mix * 0.1;
    }

    // Ripples: a gaussian band expanding outward from the click point pushes
    // each node radially; lines follow their displaced endpoints.
    ripples.current = ripples.current.filter((r) => now - r.start < 2600);
    const hasRipples = ripples.current.length > 0;

    if (hasRipples || pointsGeo.current?.userData.dirty) {
      for (let i = 0; i < basePositions.length; i++) {
        const bp = basePositions[i];
        let ox = 0;
        let oy = 0;
        let oz = 0;
        for (const r of ripples.current) {
          const t = (now - r.start) / 1000;
          const d = _v.copy(bp).sub(r.center).length();
          if (d < 0.0001) continue;
          const band = Math.exp(-(((d - t * 5.2) * 1.1) ** 2));
          const amp = 0.6 * band * Math.exp(-t * 1.4);
          if (amp > 0.001) {
            ox += ((bp.x - r.center.x) / d) * amp;
            oy += ((bp.y - r.center.y) / d) * amp;
            oz += ((bp.z - r.center.z) / d) * amp;
          }
        }
        pointArray[i * 3] = bp.x + ox;
        pointArray[i * 3 + 1] = bp.y + oy;
        pointArray[i * 3 + 2] = bp.z + oz;
      }
      for (let k = 0; k < pairs.length; k++) {
        const [a, b] = pairs[k];
        lineArray[k * 6] = pointArray[a * 3];
        lineArray[k * 6 + 1] = pointArray[a * 3 + 1];
        lineArray[k * 6 + 2] = pointArray[a * 3 + 2];
        lineArray[k * 6 + 3] = pointArray[b * 3];
        lineArray[k * 6 + 4] = pointArray[b * 3 + 1];
        lineArray[k * 6 + 5] = pointArray[b * 3 + 2];
      }
      const pg = pointsGeo.current;
      const lg = linesGeo.current;
      if (pg && lg) {
        (pg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (lg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        // One extra pass after the last ripple dies restores exact base positions.
        pg.userData.dirty = hasRipples;
      }
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry ref={linesGeo}>
          <bufferAttribute attach="attributes-position" args={[lineArray, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={linesMat} color="#5C98C2" transparent opacity={0.2} />
      </lineSegments>
      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[pointArray, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMat}
          color="#79B2DA"
          size={0.07}
          transparent
          opacity={0.9}
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
 * app, not a stack of reloaded documents. It reacts to the visitor: pointer
 * movement warms it from blue to amber, clicks send ripples through the
 * net. Never mounts under prefers-reduced-motion.
 */
export default function AmbientField() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
      {/* dpr locked to 1 and no antialiasing: this canvas runs for the whole
          session behind everything — faint dots and hairlines don't earn a
          retina-resolution render pass. */}
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
      >
        <Network />
      </Canvas>
    </div>
  );
}
