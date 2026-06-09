"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type Stage = "input" | "processing" | "done";

export default function LocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [focused, setFocused] = useState(false);
  const [stage, setStage] = useState<Stage>("input");

  const isValid = (val: string) => /^[a-zA-Z\s'-]+$/.test(val.trim()) && val.trim().length > 0;

  const handleProceed = async () => {
    const l = location.trim();
    if (!isValid(l)) return;
    const name = sessionStorage.getItem("skinstric_name") ?? "";
    setStage("processing");
    try {
      await fetch("https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location: l }),
      });
    } catch { /* proceed regardless */ }
    sessionStorage.setItem("skinstric_location", l);
    setStage("done");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Intro" />

      <p className="absolute z-[1] uppercase"
        style={{ top: 86, left: 32, fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.02em", color: "#1A1B1C" }}>
        To Start Analysis
      </p>

      {/* 3 concentric spinning diamonds — always visible */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(762px, 80vmin)", height: "min(762px, 80vmin)" }}>
        <div className="diamond-slow-a" style={{ position: "absolute", inset: 0,       border: "2px dashed #A0A4AB", opacity: 0.3 }} />
        <div className="diamond-slow-b" style={{ position: "absolute", inset: "5.25%", border: "2px dashed #A0A4AB", opacity: 0.6 }} />
        <div className="diamond-slow-c" style={{ position: "absolute", inset: "10.5%", border: "2px dashed #A0A4AB" }} />
      </div>

      {/* ── INPUT stage ── */}
      {stage === "input" && (
        <>
          <div className="absolute z-[1] flex flex-col items-center" style={{ left: "50%", top: "44vh", transform: "translateX(-50%)" }}>
            <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", textTransform: "uppercase", color: "#1A1B1C", opacity: location ? 0.4 : focused ? 0 : 0.4, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
              {location ? "Where are you from?" : "Click to type"}
            </p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleProceed()}
              placeholder="Where are you from?"
              autoFocus
              className="bg-transparent outline-none border-b border-[#1A1B1C] text-center text-[#1A1B1C] placeholder:text-[#1A1B1C]"
              style={{ fontSize: "min(3.75rem, 6vmin)", fontWeight: 400, letterSpacing: "-0.07em", width: "min(488px, 51vmin)", marginTop: 4 }}
            />
          </div>

          {/* BACK */}
          <div onClick={() => router.push("/analysis")}
            className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left"
            style={{ bottom: 48, left: 32 }}>
            <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
                <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
          </div>

          {/* PROCEED */}
          {isValid(location) && (
            <div onClick={handleProceed}
              className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-right"
              style={{ bottom: 48, right: 32 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Proceed</span>
              <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
                  <polygon points="0,0 9,5.5 0,11" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PROCESSING stage ── */}
      {stage === "processing" && (
        <>
          <div className="absolute z-[1] flex flex-col items-center gap-4" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <p style={{ fontSize: 16, fontWeight: 300, letterSpacing: "-0.01em", color: "#A0A4AB" }}>
              Processing submission
            </p>
            <div className="flex items-center gap-2">
              <span className="dot-1" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#A0A4AB" }} />
              <span className="dot-2" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#A0A4AB" }} />
              <span className="dot-3" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#A0A4AB" }} />
            </div>
          </div>

          <div onClick={() => setStage("input")}
            className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left"
            style={{ bottom: 48, left: 32 }}>
            <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
                <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
          </div>
        </>
      )}

      {/* ── DONE / THANK YOU stage ── */}
      {stage === "done" && (
        <>
          <div className="absolute z-[1] flex flex-col items-center gap-3" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <p style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.03em", color: "#1A1B1C" }}>
              Thank you!
            </p>
            <p style={{ fontSize: 14, fontWeight: 300, letterSpacing: "-0.01em", color: "#A0A4AB" }}>
              Proceed for the next step
            </p>
          </div>

          {/* BACK */}
          <div onClick={() => setStage("input")}
            className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left"
            style={{ bottom: 48, left: 32 }}>
            <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
                <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
          </div>

          {/* PROCEED */}
          <div onClick={() => router.push("/analysis/select")}
            className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-right"
            style={{ bottom: 48, right: 32 }}>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Proceed</span>
            <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
                <polygon points="0,0 9,5.5 0,11" fill="currentColor" />
              </svg>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
