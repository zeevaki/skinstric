"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import Header from "@/components/Header";

const TIPS = ["Neutral Expression", "Frontal Pose", "Adequate Lighting"];
const TIMER_OPTIONS = ["OFF", "3S", "10S"] as const;
type TimerOption = typeof TIMER_OPTIONS[number];

function HandIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <rect x="14.5" y="7" width="3" height="10" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
      <rect x="18" y="9" width="3" height="8" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
      <rect x="21.3" y="10.5" width="2.8" height="6.5" rx="1.4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
      <rect x="11" y="11.5" width="2.8" height="5.5" rx="1.4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
      <path d="M11 16.5 Q11 22 16 22 Q21 22 21.3 16.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function CameraPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [timer, setTimer] = useState<TimerOption>("OFF");
  const [countdown, setCountdown] = useState<number | null>(null);

  const doCapture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (!img) return;
    try { sessionStorage.setItem("skinstric_image", img); } catch { /* too large */ }
    setCapturedImage(img);
    setCaptured(true);
  };

  const handleTakePicture = () => {
    if (countdown !== null) return;
    if (timer === "OFF") { doCapture(); return; }
    const secs = timer === "3S" ? 3 : 10;
    setCountdown(secs);
    let remaining = secs;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) { setCountdown(null); doCapture(); }
      else { setCountdown(remaining); countdownRef.current = setTimeout(tick, 1000); }
    };
    countdownRef.current = setTimeout(tick, 1000);
  };

  const handleRetake = () => {
    setCaptured(false);
    setCapturedImage(null);
    setCountdown(null);
  };

  const back = () => router.push("/analysis/select");

  /* ── Loading / denied state ── */
  if (!ready && !denied) {
    return (
      <main className="relative h-screen w-full flex flex-col items-center justify-center" style={{ background: "#FCFCFC" }}>
        {/* Webcam hidden but mounted so it initialises immediately */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          onUserMedia={() => setReady(true)}
          onUserMediaError={() => setDenied(true)}
          style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
        />
        {/* Camera icon + 3 dashed diamonds */}
        <div style={{ position: "relative", width: "min(480px, 60vmin)", height: "min(480px, 60vmin)" }}>
          <div style={{ position: "absolute", inset: 0, border: "1.5px dashed #A0A4AB", transform: "rotate(45deg)", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: "8%", border: "1.5px dashed #A0A4AB", transform: "rotate(45deg)", opacity: 0.6 }} />
          <div style={{ position: "absolute", inset: "16%", border: "1.5px dashed #A0A4AB", transform: "rotate(45deg)" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="39" stroke="#1A1B1C" strokeWidth="1.5"/>
              <circle cx="40" cy="40" r="33" fill="#1A1B1C"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M36.5 26.5C36.1 26.65 35 27.65 34.55 28.23C34.43 28.39 34.22 28.43 33.42 28.43C31.12 28.43 29.87 29.09 29.14 30.69L28.83 31.36V36.17C28.83 40.34 28.85 40.92 29.02 41.36C29.48 42.48 30.35 43.28 31.43 43.6C32.25 43.84 46.75 43.84 47.57 43.6C48.36 43.36 49.07 42.86 49.5 42.22C50.16 41.23 50.15 41.26 50.15 36.11V31.36L49.83 30.67C49.46 29.85 48.6 29.03 47.85 28.77C47.52 28.65 46.88 28.57 46.03 28.53L44.74 28.48L43.94 27.71C43.51 27.3 43.04 26.89 42.87 26.8C42.45 26.57 37.19 26.52 36.5 26.5ZM38.68 32.69C36.14 33.37 34.59 35.97 35.26 38.46C35.49 39.33 35.8 39.87 36.51 40.6C38.01 42.14 40.3 42.54 42.22 41.56C43 41.17 44.04 40.16 44.39 39.47C45.24 37.82 45.07 35.72 44 34.27C43.47 33.57 42.56 32.9 41.75 32.6C40.94 32.29 39.5 32.22 38.68 32.69Z" fill="#FCFCFC"/>
            </svg>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C" }}>
              Setting up camera ...
            </p>
          </div>
        </div>
        {/* Tips */}
        <div className="absolute flex flex-col items-center gap-2" style={{ bottom: "10%", left: "50%", transform: "translateX(-50%)" }}>
          <p style={{ fontSize: 10, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.5, whiteSpace: "nowrap" }}>
            To get better results make sure to have
          </p>
          <div className="flex items-center gap-8">
            {TIPS.map((tip) => (
              <span key={tip} className="flex items-center gap-2" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C" }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><polygon points="5,0 10,5 5,10 0,5" stroke="#1A1B1C" strokeWidth="1" /></svg>
                {tip}
              </span>
            ))}
          </div>
        </div>
        <div onClick={back} className="absolute flex items-center gap-4 cursor-pointer select-none" style={{ bottom: 48, left: 32 }}>
          <div style={{ width: 44, height: 44, border: "1px solid #1A1B1C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" /></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
        </div>
      </main>
    );
  }

  if (denied) {
    return (
      <main className="relative h-screen w-full flex items-center justify-center" style={{ background: "#FCFCFC" }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#1A1B1C" }}>
          Camera access denied — check browser settings.
        </p>
        <div onClick={back} className="absolute flex items-center gap-4 cursor-pointer select-none" style={{ bottom: 48, left: 32 }}>
          <div style={{ width: 44, height: 44, border: "1px solid #1A1B1C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" /></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
        </div>
      </main>
    );
  }

  /* ── Camera active ── */
  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#1A1B1C" }}>
      <Header showEnterCode={false} section="Analysis" />

      {/* Live feed or captured image */}
      {captured && capturedImage ? (
        <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.92 }} />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.92 }}
        />
      )}

      {/* Oval face guide */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
        <svg viewBox="0 0 499 616" fill="none" style={{ height: "min(616px, 55vh)", width: "auto", display: "block" }}>
          <path d="M249.5 0.5C386.926 0.5 498.5 138.069 498.5 308C498.5 477.931 386.926 615.5 249.5 615.5C112.074 615.5 0.5 477.931 0.5 308C0.5 138.069 112.074 0.5 249.5 0.5Z" stroke="#FCFCFC" />
        </svg>
        {captured ? (
          <p style={{ position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 600, letterSpacing: "-0.01em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>
            Great Shot!
          </p>
        ) : countdown === null ? (
          <p style={{ position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 600, letterSpacing: "-0.01em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>
            Place your head in an ellipse
          </p>
        ) : null}
      </div>

      {/* Countdown */}
      {countdown !== null && (
        <div className="absolute z-10 flex flex-col items-center gap-2" style={{ left: "50%", top: "20%", transform: "translateX(-50%)" }}>
          {timer === "3S" ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(8px, 1.5vw, 24px)" }}>
              {[1, 2, 3].map((n) => (
                <span key={n} style={{ fontSize: n === countdown ? "clamp(3rem, 5vw, 5rem)" : "clamp(1.25rem, 2.5vw, 2.5rem)", fontWeight: 200, color: "#FCFCFC", opacity: n === countdown ? 0.85 : 0.3, transition: "all 0.25s ease", lineHeight: 1 }}>{n}</span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "clamp(4rem, 7vw, 7rem)", fontWeight: 200, color: "#FCFCFC", opacity: 0.85, lineHeight: 1 }}>{countdown}</span>
          )}
        </div>
      )}

      {/* Left — timer (hidden after capture) */}
      {!captured && (
        <div className="absolute z-[3] flex items-center gap-3 select-none" style={{ left: 32, top: "50%", transform: "translateY(-50%)" }}>
          <HandIcon />
          {TIMER_OPTIONS.map((opt) => (
            <span key={opt} onClick={() => setTimer(opt)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: timer === opt ? 1 : 0.4, cursor: "pointer" }}>{opt}</span>
          ))}
        </div>
      )}

      {/* Right — take picture / retake */}
      {captured ? (
        <div onClick={handleRetake} className="absolute z-[3] flex items-center gap-3 cursor-pointer select-none" style={{ right: 32, top: "50%", transform: "translateY(-50%)" }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: 0.7 }}>Retake</span>
          <div style={{ width: 44, height: 44, border: "1px solid rgba(255,255,255,0.6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#FCFCFC" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 4v4h4" stroke="#FCFCFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      ) : (
        <div onClick={handleTakePicture} className="absolute z-[3] cursor-pointer select-none" style={{ right: 32, top: "50%", transform: "translateY(-50%)", opacity: countdown !== null ? 0.4 : 1 }}>
          <svg width="169" height="62" viewBox="0 0 169 62" fill="none">
            <circle cx="138.001" cy="31" r="27.5556" fill="#FCFCFC"/>
            <circle cx="138" cy="31" r="30" stroke="#FCFCFC" strokeWidth="2"/>
            <path opacity="0.7" d="M4.942 37V28.796H7.896V27.2H0.126V28.796H3.094V37H4.942Z" fill="#FCFCFC"/>
            <text x="20" y="37" style={{ fontSize: 10, fontWeight: 600, fill: "#FCFCFC", fontFamily: "inherit" }}>TAKE PICTURE</text>
            <path fillRule="evenodd" clipRule="evenodd" d="M134.073 20.4C133.6 20.57 132.2 21.75 131.67 22.42C131.52 22.62 131.27 22.66 130.27 22.66C127.4 22.66 125.83 23.48 124.91 25.44L124.52 26.27V32.21C124.52 37.49 124.55 38.21 124.76 38.73C125.34 40.15 126.42 41.15 127.82 41.56C128.85 41.86 147.15 41.86 148.18 41.56C149.17 41.27 150.07 40.63 150.62 39.81C151.48 38.55 151.48 38.59 151.48 32.14V26.27L151.08 25.42C150.59 24.38 149.5 23.34 148.54 23C148.12 22.85 147.29 22.74 146.22 22.69L144.57 22.62L143.56 21.65C143 21.12 142.38 20.59 142.17 20.48C141.63 20.18 134.87 20.12 134.073 20.4ZM136.36 25.87C133 26.8 130.98 30.2 131.85 33.48C132.15 34.63 132.55 35.31 133.46 36.25C135.4 38.24 138.39 38.76 140.85 37.52C141.84 37.03 143.19 35.73 143.65 34.83C144.74 32.73 144.52 30.08 143.1 28.22C142.42 27.31 141.27 26.45 140.25 26.07C139.21 25.67 137.39 25.58 136.36 25.87Z" fill="#A0A4AB"/>
          </svg>
        </div>
      )}

      {/* Bottom tips */}
      <div className="absolute z-[3] flex flex-col items-center gap-2" style={{ bottom: "12%", left: "50%", transform: "translateX(-50%)" }}>
        <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "-0.01em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
          To get better results make sure to have
        </p>
        <div className="flex items-center gap-8">
          {TIPS.map((tip) => (
            <span key={tip} className="flex items-center gap-2" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "-0.01em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><polygon points="5,0 10,5 5,10 0,5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" /></svg>
              {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Proceed after capture */}
      {captured && (
        <div onClick={() => router.push("/analysis/processing")} className="absolute z-[3] flex items-center gap-4 cursor-pointer select-none" style={{ bottom: 48, right: 32 }}>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: 0.7 }}>Proceed</span>
          <div style={{ width: 44, height: 44, border: "1px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="0,0 9,5.5 0,11" fill="#FCFCFC" /></svg>
          </div>
        </div>
      )}

      {/* Back */}
      <div onClick={back} className="absolute z-[3] flex items-center gap-4 cursor-pointer select-none" style={{ bottom: 48, left: 32 }}>
        <div style={{ width: 44, height: 44, border: "1px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#FCFCFC" /></svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: 0.7 }}>Back</span>
      </div>
    </main>
  );
}
