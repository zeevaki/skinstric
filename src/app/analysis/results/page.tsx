"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const ANALYSIS = {
  skinType: "Combination",
  tone: "Medium / Fair",
  ageRange: "24 – 30",
  scores: [
    { label: "Hydration",    value: 72 },
    { label: "Oiliness",     value: 58 },
    { label: "Sensitivity",  value: 35 },
    { label: "Pigmentation", value: 28 },
    { label: "Fine Lines",   value: 15 },
  ],
  concerns: ["Mild dehydration", "T-zone oiliness", "Minor sun exposure"],
  routine: {
    morning: ["Gentle foaming cleanser", "Hyaluronic acid serum", "Lightweight SPF 50 moisturiser"],
    evening: ["Micellar cleansing oil", "Niacinamide 10% serum", "Barrier repair moisturiser"],
  },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 100); }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/60">{label}</span>
        <span className="text-[9px] font-medium tracking-[0.1em] text-[#1a1a1a]">{value}%</span>
      </div>
      <div className="h-px w-full bg-[#1a1a1a]/10 relative">
        <div
          className="absolute top-0 left-0 h-px bg-[#1a1a1a] transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 cursor-pointer select-none group"
    >
      <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
        <div className="absolute w-7 h-7 rotate-45 border border-[#1a1a1a]" />
        <svg className="relative z-10" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <polyline points="7,1 3,5 7,9" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </div>
      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]">
        Back to Home
      </span>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(sessionStorage.getItem("skinstric_name") ?? "");
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#f5f3f0]">
      <Header showEnterCode={false} section="Results" />

      <div className="pt-20 pb-16 px-8 md:px-12 max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="mb-10">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40 mb-1">
            Analysis Complete
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-[300] tracking-tight text-[#1a1a1a] leading-tight">
            {name ? `Hello, ${name}.` : "Hello."}
          </h1>
          <p className="text-[11px] font-[300] tracking-wide text-[#1a1a1a]/50 mt-2 uppercase">
            Your A.I. skin analysis is complete
          </p>
        </div>

        {/* Top grid: Skin Type + Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]/10 mb-px">
          <div className="bg-[#f5f3f0] p-8 flex flex-col gap-3">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40">Skin Type</p>
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-[300] text-[#1a1a1a] tracking-tight">
              {ANALYSIS.skinType}
            </p>
            <div className="flex gap-2 mt-auto flex-wrap">
              {ANALYSIS.concerns.map((c) => (
                <span key={c} className="text-[8px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a]/50 border border-[#1a1a1a]/20 px-2 py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#f5f3f0] p-8 flex flex-col gap-4">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40">Demographics</p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a]/40 mb-0.5">Estimated Age</p>
                <p className="text-[1.5rem] font-[300] text-[#1a1a1a] tracking-tight">{ANALYSIS.ageRange}</p>
              </div>
              <div>
                <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a]/40 mb-0.5">Skin Tone</p>
                <p className="text-[1.5rem] font-[300] text-[#1a1a1a] tracking-tight">{ANALYSIS.tone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-[#f5f3f0] border-t border-[#1a1a1a]/10 p-8 flex flex-col gap-5 mb-px">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40">Skin Metrics</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {ANALYSIS.scores.map((s) => (
              <ScoreBar key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>

        {/* Routine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]/10 mb-12">
          <div className="bg-[#f5f3f0] p-8 flex flex-col gap-4">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40">Morning Routine</p>
            <ol className="flex flex-col gap-3">
              {ANALYSIS.routine.morning.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-[9px] font-medium tracking-[0.15em] text-[#1a1a1a]/30 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-[300] text-[#1a1a1a] tracking-wide">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[#f5f3f0] p-8 flex flex-col gap-4">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]/40">Evening Routine</p>
            <ol className="flex flex-col gap-3">
              {ANALYSIS.routine.evening.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-[9px] font-medium tracking-[0.15em] text-[#1a1a1a]/30 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-[300] text-[#1a1a1a] tracking-wide">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <BackButton onClick={() => router.push("/")} />
      </div>
    </main>
  );
}
