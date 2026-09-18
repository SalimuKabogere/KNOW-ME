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
          <span className="hud-label">salimuloma@gmail.com</span>
        </div>

        {/* Center */}
        <span className="hidden hud-label md:inline">+256772043489</span>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <span className="hud-label !text-white/55">Optimus-Prime</span>
          </span>
        </div>
      </div>
    </div>
  );
}
