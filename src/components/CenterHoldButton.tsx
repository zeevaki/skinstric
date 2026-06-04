"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HOLD_MS = 600;
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CenterHoldButton() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);

  const start = () => {
    if (timerRef.current) return;
    setHolding(true);

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      router.push("/intro");
    }, HOLD_MS);

    const release = () => {
      setHolding(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    window.addEventListener("mouseup", release, { once: true });
    window.addEventListener("touchend", release, { once: true });
  };

  return (
    <div
      onMouseDown={start}
      onTouchStart={(e) => { e.preventDefault(); start(); }}
      className="center-btn absolute flex flex-col items-center gap-2 z-[2] cursor-pointer select-none"
      style={{ top: "72vh", opacity: holding ? 0.8 : 0.5, transition: "opacity 0.2s" }}
    >
      <div className="relative">
        <svg
          className="absolute inset-0 pointer-events-none"
          width="95" height="95"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="47.5" cy="47.5" r={RADIUS}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={holding ? 0 : CIRCUMFERENCE}
            style={{
              transition: holding ? `stroke-dashoffset ${HOLD_MS}ms linear` : "none",
            }}
          />
        </svg>

        <svg width="95" height="95" viewBox="0 0 143 143" fill="none">
          <polygon points="71.5,8 135,71.5 71.5,135 8,71.5" stroke="#A0A4AB" strokeWidth="1.5" />
          <polygon points="71.5,30 113,71.5 71.5,113 30,71.5" stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="64"   y1="8"    x2="79"   y2="8"    stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="71.5" y1="1"    x2="71.5" y2="16"   stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="128"  y1="71.5" x2="143"  y2="71.5" stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="135"  y1="64"   x2="135"  y2="79"   stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="64"   y1="135"  x2="79"   y2="135"  stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="71.5" y1="128"  x2="71.5" y2="143"  stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="1"    y1="71.5" x2="16"   y2="71.5" stroke="#A0A4AB" strokeWidth="1.5" />
          <line x1="8"    y1="64"   x2="8"    y2="79"   stroke="#A0A4AB" strokeWidth="1.5" />
          <rect x="67" y="67" width="9" height="9" transform="rotate(45 71.5 71.5)" fill="#5a5a5a" />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]">Tap and hold</p>
        <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]">to proceed to section</p>
      </div>
    </div>
  );
}
