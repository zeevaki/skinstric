"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type Category = "race" | "age" | "gender";
type Analysis = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

function sorted(obj: Record<string, number>) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}
function topKey(obj: Record<string, number>) {
  return sorted(obj)[0]?.[0] ?? "";
}
function pct(val: number) {
  return (val * 100).toFixed(2);
}

const LABELS: Record<Category, string> = { race: "Race", age: "Age", gender: "Sex" };
const DISPLAY: Record<Category, string> = { race: "Race", age: "Age", gender: "Gender" };

function CircleChart({ value }: { value: number }) {
  const r = 120;
  const circ = 2 * Math.PI * r;
  const dash = circ * value;
  return (
    <svg width="280" height="280" viewBox="0 0 280 280">
      <circle cx="140" cy="140" r={r} fill="none" stroke="#E8E8E8" strokeWidth="2" />
      <circle cx="140" cy="140" r={r} fill="none" stroke="#1A1B1C" strokeWidth="2"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x="140" y="135" textAnchor="middle" style={{ fontSize: 44, fontWeight: 300, fill: "#1A1B1C", fontFamily: "inherit" }}>
        {pct(value)}
      </text>
      <text x="158" y="118" textAnchor="start" style={{ fontSize: 13, fontWeight: 300, fill: "#1A1B1C", fontFamily: "inherit" }}>%</text>
    </svg>
  );
}

export default function DemographicsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [active, setActive] = useState<Category>("race");
  const [overrides, setOverrides] = useState<Record<Category, string>>({ race: "", age: "", gender: "" });

  useEffect(() => {
    const raw = sessionStorage.getItem("skinstric_analysis");
    if (raw) {
      const data = JSON.parse(raw) as Analysis;
      setAnalysis(data);
      setOverrides({ race: topKey(data.race), age: topKey(data.age), gender: topKey(data.gender) });
    }
  }, []);

  if (!analysis) {
    return (
      <main className="relative h-screen w-full flex items-center justify-center" style={{ background: "#FCFCFC" }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#1A1B1C", opacity: 0.4 }}>
          No analysis data — please complete the photo step first.
        </p>
      </main>
    );
  }

  const current = analysis[active];
  const entries = sorted(current);
  const selectedKey = overrides[active];
  const selectedVal = current[selectedKey] ?? 0;

  const sidebarItems: { cat: Category; value: string }[] = [
    { cat: "race", value: overrides.race },
    { cat: "age", value: overrides.age },
    { cat: "gender", value: overrides.gender },
  ];

  return (
    <main className="relative w-full overflow-hidden md:h-screen" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Analysis" />

      {/* Title */}
      <div className="absolute z-[1]" style={{ top: 86, left: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.5 }}>
          A. I. Analysis
        </p>
        <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#1A1B1C", lineHeight: 1 }}>
            Demographics
          </h1>
          <div className="flex gap-2" style={{ marginTop: 4 }}>
            <button onClick={() => router.push("/analysis/results")} style={{ width: 24, height: 24, border: "1px solid #1A1B1C", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)" }}>
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none" style={{ transform: "rotate(-45deg)" }}><polygon points="6,0 0,4 6,8" fill="#1A1B1C" /></svg>
            </button>
            <button style={{ width: 24, height: 24, border: "1px solid #1A1B1C", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)" }}>
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none" style={{ transform: "rotate(-45deg)" }}><polygon points="0,0 6,4 0,8" fill="#1A1B1C" /></svg>
            </button>
          </div>
        </div>
        <p style={{ fontSize: 10, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.5, marginTop: 6 }}>
          Predicted Race &amp; Age
        </p>
      </div>

      {/* ── MOBILE layout (< md) ── */}
      <div className="md:hidden flex flex-col" style={{ paddingTop: 160, paddingBottom: 120 }}>
        {/* Tab bar */}
        <div className="flex border-b border-[#E8E8E8]">
          {sidebarItems.map(({ cat, value }) => (
            <button key={cat} onClick={() => setActive(cat)}
              className="flex-1 py-4 px-2 text-center"
              style={{ background: active === cat ? "#1A1B1C" : "transparent", border: "none", cursor: "pointer" }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: active === cat ? "#FCFCFC" : "#1A1B1C" }}>
                {value.toUpperCase()}
              </p>
              <p style={{ fontSize: 9, textTransform: "uppercase", color: active === cat ? "rgba(255,255,255,0.5)" : "rgba(26,27,28,0.4)", marginTop: 2 }}>
                {LABELS[cat]}
              </p>
            </button>
          ))}
        </div>

        {/* Selected label */}
        <div style={{ padding: "24px 24px 8px" }}>
          <p style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.03em", color: "#1A1B1C" }}>
            {selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}{active === "age" ? " y.o." : ""}
          </p>
        </div>

        {/* List */}
        <div className="flex flex-col border-t border-[#E8E8E8]">
          <div style={{ padding: "10px 24px", borderBottom: "1px solid #E8E8E8", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1A1B1C" }}>{DISPLAY[active]}</span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1A1B1C" }}>A.I. Confidence</span>
          </div>
          {entries.map(([key, val]) => {
            const isSel = key === selectedKey;
            return (
              <div key={key} onClick={() => setOverrides(p => ({ ...p, [active]: key }))}
                className="flex items-center justify-between cursor-pointer"
                style={{ padding: "14px 24px", borderBottom: "1px solid #E8E8E8", background: isSel ? "#1A1B1C" : "transparent" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 10, height: 10, border: isSel ? "none" : "1px solid #1A1B1C", background: isSel ? "#FCFCFC" : "none", transform: "rotate(45deg)" }} />
                  <span style={{ fontSize: 11, fontWeight: isSel ? 600 : 400, color: isSel ? "#FCFCFC" : "#1A1B1C" }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: isSel ? "#FCFCFC" : "#1A1B1C" }}>{pct(val)} %</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP layout (≥ md) ── */}
      {/* Left sidebar */}
      <div className="hidden md:flex absolute z-[1] flex-col"
        style={{ top: "50%", left: 0, transform: "translateY(-50%)", width: 196, borderRight: "1px solid #E8E8E8" }}>
        {sidebarItems.map(({ cat, value }) => (
          <div key={cat} onClick={() => setActive(cat)} className="cursor-pointer"
            style={{ padding: "20px 24px", background: active === cat ? "#1A1B1C" : "transparent", borderBottom: "1px solid #E8E8E8" }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: active === cat ? "#FCFCFC" : "#1A1B1C" }}>
              {value.toUpperCase()}
            </p>
            <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: active === cat ? "rgba(255,255,255,0.6)" : "rgba(26,27,28,0.5)", marginTop: 4 }}>
              {LABELS[cat]}
            </p>
          </div>
        ))}
      </div>

      {/* Center chart */}
      <div className="hidden md:flex absolute z-[1] flex-col items-start justify-center"
        style={{ left: 196, right: 340, top: "50%", transform: "translateY(-50%)", paddingLeft: 48 }}>
        <p style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.03em", color: "#1A1B1C", marginBottom: 32 }}>
          {selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}{active === "age" ? " y.o." : ""}
        </p>
        <div style={{ background: "#F0F0F0", padding: 32, display: "inline-block" }}>
          <CircleChart value={selectedVal} />
        </div>
      </div>

      {/* Right list */}
      <div className="hidden md:flex absolute z-[1] flex-col overflow-y-auto"
        style={{ top: "50%", right: 0, transform: "translateY(-50%)", width: 340, maxHeight: "60vh", borderLeft: "1px solid #E8E8E8" }}>
        <div style={{ padding: "12px 24px", borderBottom: "1px solid #E8E8E8", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1A1B1C" }}>{DISPLAY[active]}</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1A1B1C" }}>A. I. Confidence</span>
        </div>
        {entries.map(([key, val]) => {
          const isSel = key === selectedKey;
          return (
            <div key={key} onClick={() => setOverrides(p => ({ ...p, [active]: key }))}
              className="cursor-pointer flex items-center justify-between"
              style={{ padding: "14px 24px", borderBottom: "1px solid #E8E8E8", background: isSel ? "#1A1B1C" : "transparent" }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 10, height: 10, border: isSel ? "none" : "1px solid #1A1B1C", background: isSel ? "#FCFCFC" : "none", transform: "rotate(45deg)" }} />
                <span style={{ fontSize: 11, fontWeight: isSel ? 600 : 400, letterSpacing: "-0.02em", color: isSel ? "#FCFCFC" : "#1A1B1C" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
              <span style={{ fontSize: 11, color: isSel ? "#FCFCFC" : "#1A1B1C" }}>{pct(val)} %</span>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <p className="absolute z-[1] hidden md:block"
        style={{ bottom: 80, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.4, whiteSpace: "nowrap" }}>
        If A.I. estimate is wrong, select the correct one.
      </p>

      {/* BACK */}
      <div onClick={() => router.push("/analysis/results")}
        className="fixed md:absolute z-[10] flex items-center gap-3 cursor-pointer select-none nav-btn-bottom nav-btn-left"
        style={{ bottom: 48, left: 32 }}>
        <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" /></svg>
        </div>
        <span className="hidden sm:inline" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>

      {/* RESET / CONFIRM */}
      <div className="fixed md:absolute z-[10] flex gap-3 nav-btn-bottom nav-btn-right" style={{ bottom: 48, right: 32 }}>
        <button onClick={() => setOverrides(prev => ({ ...prev, [active]: topKey(analysis[active]) }))}
          style={{ padding: "10px 16px", border: "1px solid #1A1B1C", background: "transparent", fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", cursor: "pointer" }}>
          Reset
        </button>
        <button onClick={() => router.push("/analysis/results")}
          style={{ padding: "10px 16px", border: "none", background: "#1A1B1C", fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", cursor: "pointer" }}>
          Confirm
        </button>
      </div>
    </main>
  );
}
