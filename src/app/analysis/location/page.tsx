"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = (val: string) => /^[a-zA-Z\s'-]+$/.test(val.trim()) && val.trim().length > 0;

  const handleProceed = async () => {
    const l = location.trim();
    if (!isValid(l)) return;
    const name = sessionStorage.getItem("skinstric_name") ?? "";
    setLoading(true);
    try {
      await fetch("https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location: l }),
      });
    } catch { /* proceed regardless */ }
    sessionStorage.setItem("skinstric_location", l);
    setLoading(false);
    router.push("/analysis/select");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Intro" />

      <p
        className="absolute z-[1] uppercase"
        style={{ top: 86, left: 32, fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.02em", color: "#1A1B1C" }}
      >
        To Start Analysis
      </p>

      {/* 3 concentric diamonds */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(762px, 80vmin)", height: "min(762px, 80vmin)" }}>
        <div style={{ position: "absolute", inset: 0,       border: "2px dashed #A0A4AB", transform: "rotate(45deg)", opacity: 0.3 }} />
        <div style={{ position: "absolute", inset: "5.25%", border: "2px dashed #A0A4AB", transform: "rotate(45deg)", opacity: 0.6 }} />
        <div style={{ position: "absolute", inset: "10.5%", border: "2px dashed #A0A4AB", transform: "rotate(45deg)" }} />
      </div>

      {/* Input */}
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
          className="bg-transparent outline-none border-b border-[#1A1B1C] text-center text-[#1A1B1C] placeholder:text-[#1A1B1C]"
          style={{ fontSize: "min(3.75rem, 6vmin)", fontWeight: 400, letterSpacing: "-0.07em", width: "min(488px, 51vmin)", marginTop: 4 }}
        />
      </div>

      {/* BACK */}
      <div
        onClick={() => router.push("/analysis")}
        className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left" style={{ bottom: 48, left: 32 }}
      >
        <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
            <polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>

      {/* PROCEED — only when location is valid */}
      {isValid(location) && !loading && (
        <div
          onClick={handleProceed}
          className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-right" style={{ bottom: 48, right: 32 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Proceed</span>
          <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
              <polygon points="0,0 9,5.5 0,11" fill="#1A1B1C" />
            </svg>
          </div>
        </div>
      )}
    </main>
  );
}
