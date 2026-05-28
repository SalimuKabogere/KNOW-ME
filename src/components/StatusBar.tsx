"use client";

import { useEffect, useState } from "react";

function useKampalaClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Africa/Kampala",
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function StatusBar() {
  const time = useKampalaClock();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="container-x flex items-center justify-between px-5 py-2.5 sm:px-8 lg:px-16">
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className="hud-label">Kampala, Uganda</span>
          <span className="hidden hud-label sm:inline">/ Lat 0.31°N</span>
        </div>

        {/* Center */}
        <span className="hidden hud-label md:inline">Portfolio — 2026</span>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="hud-label !text-white/55">Open to work</span>
          </span>
          <span className="hud-label tabular-nums">{time}</span>
        </div>
      </div>
    </div>
  );
}
