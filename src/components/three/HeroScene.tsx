"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

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
    m.rotation.y += delta * 0.15;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, pointer.current.y * 0.3, 0.04);
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, pointer.current.x * 0.15, 0.04);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 10]} />
        <MeshDistortMaterial
          color="#79B2DA"
          distort={0.38}
          speed={1.6}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

/**
 * Decorative wireframe blob rendered behind the hero copy — small, faint
 * and translucent so it reads as ambient texture, not a competing focal
 * point. Client-only (dynamic-imported with ssr:false by the caller) since
 * it touches the canvas/GPU. Skips itself under prefers-reduced-motion.
 */
export default function HeroScene() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 opacity-45 [mask-image:radial-gradient(circle_at_center,#000_22%,transparent_50%)]">
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
