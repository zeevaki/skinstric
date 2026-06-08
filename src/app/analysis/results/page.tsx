"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const CATEGORIES = [
  { label: "Demographics",      sub: null,              top: true  },
  { label: "Skin Type\nDetails", sub: null,             left: true },
  { label: "Cosmetic\nConcerns", sub: null,             right: true},
  { label: "Weather",           sub: null,              bottom: true},
];

export default function ResultsPage() {
  const router = useRouter();

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Analysis" />

      {/* Top-left labels */}
      <div className="absolute z-[1]" style={{ top: 86, left: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.5 }}>
          A. I. Analysis
        </p>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", marginTop: 4 }}>
          A. I. has estimated the following.
        </p>
        <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.6 }}>
          Fix estimated information if needed.
        </p>
      </div>

      {/* Diamond hub */}
      <div
        className="absolute"
        style={{
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 70vmin)",
          height: "min(520px, 70vmin)",
        }}
      >
        {/* Outer dashed diamond */}
        <div style={{ position: "absolute", inset: "-12%", border: "1.5px dashed #A0A4AB", transform: "rotate(45deg)", opacity: 0.3 }} />

        {/* Top — Demographics (clickable, slightly larger) */}
        <div
          onClick={() => router.push("/analysis/demographics")}
          className="cursor-pointer"
          style={{
            position: "absolute",
            width: "42%", height: "42%",
            top: "4%", left: "29%",
            background: "#E8E8E8",
            transform: "rotate(45deg)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(-45deg)", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", textAlign: "center", color: "#1A1B1C" }}>
            Demographics
          </span>
        </div>

        {/* Left — Skin Type Details */}
        <div
          style={{
            position: "absolute",
            width: "42%", height: "42%",
            top: "29%", left: "4%",
            background: "#E8E8E8",
            transform: "rotate(45deg)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(-45deg)", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", textAlign: "center", color: "#1A1B1C" }}>
            Skin Type{"\n"}Details
          </span>
        </div>

        {/* Right — Cosmetic Concerns */}
        <div
          style={{
            position: "absolute",
            width: "42%", height: "42%",
            top: "29%", left: "54%",
            background: "#E8E8E8",
            transform: "rotate(45deg)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(-45deg)", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", textAlign: "center", color: "#1A1B1C" }}>
            Cosmetic{"\n"}Concerns
          </span>
        </div>

        {/* Bottom — Weather */}
        <div
          style={{
            position: "absolute",
            width: "42%", height: "42%",
            top: "54%", left: "29%",
            background: "#E8E8E8",
            transform: "rotate(45deg)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(-45deg)", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", textAlign: "center", color: "#1A1B1C" }}>
            Weather
          </span>
        </div>
      </div>

      {/* BACK */}
      <div
        onClick={() => router.push("/analysis/select")}
        className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left" style={{ bottom: 48, left: 32 }}
      >
        <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
            <polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>

      {/* GET SUMMARY */}
      <div
        className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-right" style={{ bottom: 48, right: 32 }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Get Summary</span>
        <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
            <polygon points="0,0 9,5.5 0,11" fill="#1A1B1C" />
          </svg>
        </div>
      </div>
    </main>
  );
}
