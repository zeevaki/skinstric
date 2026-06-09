"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const modalBtnStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase",
  color: "#FCFCFC", background: "none", border: "none", cursor: "pointer",
};

function Modal({ step, onLeave, onStay, onConfirmLeave, onChangedMind }: {
  step: "confirm" | "sad";
  onLeave: () => void;
  onStay: () => void;
  onConfirmLeave: () => void;
  onChangedMind: () => void;
}) {
  return (
    <div
      className="absolute z-50 flex flex-col justify-between"
      style={{ top: 48, left: 32, width: 432, height: 136, background: "#1A1B1C" }}
    >
      {step === "confirm" ? (
        <>
          <p style={{ padding: "24px 24px 0", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", lineHeight: "18px" }}>
            You are about to leave analysis.<br />Are you sure?
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "flex-end", gap: 24, padding: "12px 24px" }}>
            <button onClick={onLeave} style={{ ...modalBtnStyle, opacity: 0.6 }}>Leave</button>
            <button onClick={onStay} style={modalBtnStyle}>Stay</button>
          </div>
        </>
      ) : (
        <>
          <p style={{ padding: "24px 24px 0", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", lineHeight: "18px" }}>
            Sad to see you go.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", padding: "12px 24px" }}>
            <button onClick={onChangedMind} style={modalBtnStyle}>Changed my mind</button>
            <button onClick={onConfirmLeave} style={{ ...modalBtnStyle, opacity: 0.6 }}>...</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [modal, setModal] = useState<"none" | "confirm" | "sad">("none");

  const isValid = (val: string) => /^[a-zA-Z\s'-]+$/.test(val.trim()) && val.trim().length > 0;

  const handleProceed = () => {
    const n = name.trim();
    if (!isValid(n)) return;
    sessionStorage.setItem("skinstric_name", n);
    router.push("/analysis/location");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      {modal !== "none" && (
        <Modal
          step={modal}
          onLeave={() => setModal("sad")}
          onStay={() => setModal("none")}
          onConfirmLeave={() => router.push("/intro")}
          onChangedMind={() => setModal("none")}
        />
      )}

      <Header showEnterCode={false} section="Intro" />

      <p
        className="absolute z-[1] uppercase"
        style={{ top: 86, left: 32, fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.02em", color: "#1A1B1C" }}
      >
        To Start Analysis
      </p>

      {/* 3 concentric diamonds */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(762px, 80vmin)", height: "min(762px, 80vmin)" }}>
        <div className="diamond-slow-a" style={{ position: "absolute", inset: 0,       border: "2px dashed #A0A4AB", opacity: 0.3 }} />
        <div className="diamond-slow-b" style={{ position: "absolute", inset: "5.25%", border: "2px dashed #A0A4AB", opacity: 0.6 }} />
        <div className="diamond-slow-c" style={{ position: "absolute", inset: "10.5%", border: "2px dashed #A0A4AB" }} />
      </div>

      {/* Input */}
      <div className="absolute z-[1] flex flex-col items-center" style={{ left: "50%", top: "44vh", transform: "translateX(-50%)" }}>
        <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", textTransform: "uppercase", color: "#1A1B1C", opacity: name ? 0.4 : focused ? 0 : 0.4, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          {name ? "Introduce Yourself" : "Click to type"}
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleProceed()}
          placeholder="Introduce Yourself"
          className="bg-transparent outline-none border-b border-[#1A1B1C] text-center text-[#1A1B1C] placeholder:text-[#1A1B1C]"
          style={{ fontSize: "min(3.75rem, 6vmin)", fontWeight: 400, letterSpacing: "-0.07em", width: "min(488px, 51vmin)", marginTop: 4 }}
        />
      </div>

      {/* BACK */}
      <div
        onClick={() => name.trim() ? setModal("confirm") : router.push("/intro")}
        className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left" style={{ bottom: 48, left: 32 }}
      >
        <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
            <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>

      {/* PROCEED — only when name is valid */}
      {isValid(name) && (
        <div
          onClick={handleProceed}
          className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-right" style={{ bottom: 48, right: 32 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Proceed</span>
          <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
              <polygon points="0,0 9,5.5 0,11" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </main>
  );
}
