"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

// Recomputes ScrollTrigger positions once layout has settled (fonts, images)
// and after each client-side route change, so reveal triggers fire at the
// correct scroll positions on every page.
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(() => requestAnimationFrame(refresh));
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
