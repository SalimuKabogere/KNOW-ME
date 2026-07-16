"use client";

import dynamic from "next/dynamic";

// Root layout is a Server Component, and `ssr: false` dynamic imports are
// only permitted inside a Client Component boundary — this tiny wrapper is
// that boundary so the three.js canvas never runs during SSR.
const AmbientField = dynamic(() => import("./AmbientField"), { ssr: false });

export default function AmbientFieldLoader() {
  return <AmbientField />;
}
