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

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#1A1B1C" }}>

      {/* Single Webcam — always mounted, visible only when ready and not captured */}
      {!captured && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          onUserMedia={() => setReady(true)}
          onUserMediaError={() => setDenied(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: ready ? 0.92 : 0 }}
        />
      )}

      {/* Captured image */}
      {captured && capturedImage && (
        <img src={capturedImage} alt="captured" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.92 }} />
      )}

      {/* ── Loading overlay — sits on top until camera is ready ── */}
      {!ready && !denied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: "#FCFCFC" }}>
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
        </div>
      )}

      {/* ── Denied overlay ── */}
      {denied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: "#FCFCFC" }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#1A1B1C", textAlign: "center", padding: "0 32px" }}>
            Camera access denied.<br />Check browser &amp; Windows camera settings.
          </p>
          <div onClick={back} className="absolute flex items-center gap-4 cursor-pointer select-none" style={{ bottom: 48, left: 32 }}>
            <div style={{ width: 44, height: 44, border: "1px solid #1A1B1C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" /></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
          </div>
        </div>
      )}

      {/* ── Camera active UI ── */}
      {ready && (
        <>
          <Header showEnterCode={false} section="Analysis" />

          {/* Oval guide */}
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
                    <span key={n} style={{ fontSize: n === countdown ? "clamp(3rem,5vw,5rem)" : "clamp(1.25rem,2.5vw,2.5rem)", fontWeight: 200, color: "#FCFCFC", opacity: n === countdown ? 0.85 : 0.3, transition: "all 0.25s ease", lineHeight: 1 }}>{n}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: "clamp(4rem,7vw,7rem)", fontWeight: 200, color: "#FCFCFC", opacity: 0.85, lineHeight: 1 }}>{countdown}</span>
              )}
            </div>
          )}

          {/* Timer selector */}
          {!captured && (
            <div className="absolute z-[3] flex items-center gap-3 select-none" style={{ left: 32, top: "50%", transform: "translateY(-50%)" }}>
              <HandIcon />
              {TIMER_OPTIONS.map((opt) => (
                <span key={opt} onClick={() => setTimer(opt)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: timer === opt ? 1 : 0.4, cursor: "pointer" }}>{opt}</span>
              ))}
            </div>
          )}

          {/* Take picture / Retake */}
          {captured ? (
            <div onClick={handleRetake} className="absolute z-[3] flex items-center gap-3 cursor-pointer select-none" style={{ right: 32, top: "50%", transform: "translateY(-50%)" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", opacity: 0.7 }}>Retake</span>
              <div style={{ width: 44, height: 44, border: "1px solid rgba(255,255,255,0.6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#FCFCFC" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 4v4h4" stroke="#FCFCFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ) : (
            <div onClick={handleTakePicture} className="absolute z-[3] cursor-pointer select-none" style={{ right: 32, top: "50%", transform: "translateY(-50%)", opacity: countdown !== null ? 0.4 : 1 }}>
              <svg width="169" height="62" viewBox="0 0 169 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="138.001" cy="31" r="27.5556" fill="#FCFCFC"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M134.073 20.4013C133.598 20.5719 132.2 21.7484 131.674 22.4205C131.521 22.6159 131.265 22.6593 130.269 22.6593C127.405 22.6593 125.832 23.4755 124.912 25.4401L124.521 26.2747V32.2093C124.521 37.4902 124.547 38.2079 124.758 38.7253C125.336 40.1466 126.417 41.1454 127.823 41.5577C128.848 41.8579 147.151 41.8579 148.176 41.5577C149.172 41.2658 150.066 40.6275 150.621 39.8118C151.483 38.5465 151.478 38.5872 151.478 32.1411V26.2747L151.076 25.4164C150.59 24.3777 149.504 23.3395 148.545 22.9986C148.123 22.8482 147.285 22.738 146.225 22.6934L144.566 22.6237L143.555 21.6524C142.999 21.1182 142.377 20.589 142.172 20.4764C141.634 20.1794 134.865 20.1165 134.073 20.4013ZM141.398 21.845C141.604 21.9223 142.266 22.4596 142.869 23.0387L143.965 24.0918L145.786 24.1701C147.764 24.2551 148.336 24.4228 149.048 25.1255C149.911 25.9771 149.901 25.8831 149.858 32.3977L149.819 38.3254L149.398 38.9168C149.167 39.2421 148.7 39.6617 148.362 39.8493L147.746 40.1904H138H128.254L127.638 39.8493C127.299 39.6617 126.833 39.2421 126.601 38.9168L126.18 38.3254L126.142 32.3977C126.099 25.8585 126.085 25.9826 126.975 25.1232C127.72 24.4046 128.228 24.2554 130.221 24.1701L132.049 24.0918L133.055 23.1098C134.537 21.6617 134.382 21.7061 137.956 21.7051C139.73 21.7047 141.181 21.7636 141.398 21.845ZM136.355 25.868C133 26.7979 130.983 30.2039 131.847 33.4808C132.15 34.628 132.547 35.3075 133.464 36.2499C135.403 38.2424 138.386 38.7558 140.851 37.5211C141.839 37.0266 143.186 35.7328 143.651 34.8325C144.736 32.7348 144.517 30.0836 143.105 28.2201C142.417 27.3121 141.274 26.4497 140.248 26.0654C139.206 25.6749 137.385 25.5825 136.355 25.868ZM145.279 26.1831C145.011 26.4749 144.979 27.0365 145.216 27.2706C145.318 27.3711 145.816 27.4343 146.508 27.4343C147.423 27.4343 147.676 27.3876 147.862 27.1848C148.166 26.8532 148.151 26.5384 147.815 26.2064C147.426 25.8231 145.624 25.8066 145.279 26.1831ZM140.002 27.6205C140.966 28.0561 141.934 29.0178 142.397 29.9997C142.702 30.6481 142.763 30.9688 142.763 31.9364C142.763 33.356 142.369 34.3167 141.39 35.2822C140.428 36.232 139.447 36.6191 138 36.6191C136.553 36.6191 135.571 36.232 134.609 35.2822C133.631 34.3167 133.236 33.356 133.236 31.9364C133.236 30.9688 133.297 30.6481 133.603 29.9997C134.216 28.6976 135.489 27.6418 136.857 27.3013C137.698 27.0921 139.162 27.2407 140.002 27.6205Z" fill="#A0A4AB"/>
                <circle cx="138" cy="31" r="30" stroke="#FCFCFC" strokeWidth="2"/>
                <path opacity="0.7" d="M4.942 37V28.796H7.896V27.2H0.126V28.796H3.094V37H4.942ZM15.8126 37L12.0326 27.2H10.2966L6.53056 37H8.43456L9.27456 34.718H13.0546L13.8946 37H15.8126ZM11.1786 29.566L12.4946 33.15H9.86256L11.1786 29.566ZM24.9398 37L20.9778 31.092L24.5758 27.2H22.2658L18.3318 31.47V27.2H16.4698V37H18.3318V33.948L19.7038 32.464L22.6438 37H24.9398ZM32.3698 37V35.39H27.5398V32.772H31.2917V31.176H27.5398V28.796H32.2158V27.2H25.6917V37H32.3698ZM38.1773 37V33.276H40.2493C42.2933 33.276 43.5113 32.016 43.5113 30.238C43.5113 28.46 42.2933 27.2 40.2493 27.2H36.3153V37H38.1773ZM38.1773 28.754H40.1653C41.2573 28.754 41.7053 29.454 41.7053 30.238C41.7053 31.022 41.2573 31.722 40.1653 31.722H38.1773V28.754ZM46.2919 37V27.2H44.4299V37H46.2919ZM52.3063 37.112C54.7143 37.112 56.5063 35.726 56.7023 33.696H54.8543C54.6863 34.76 53.6503 35.502 52.3063 35.502C50.5983 35.502 49.3103 34.326 49.3103 32.1C49.3103 29.874 50.5983 28.684 52.3063 28.684C53.6223 28.684 54.6583 29.426 54.7983 30.504H56.7303C56.4643 28.474 54.6723 27.088 52.3063 27.088C49.7443 27.088 47.4483 28.768 47.4483 32.1C47.4483 35.432 49.7023 37.112 52.3063 37.112ZM61.5731 37V28.796H64.5271V27.2H56.7571V28.796H59.7251V37H61.5731ZM68.9825 37.112C71.2785 37.112 72.8325 35.838 72.8325 33.458V27.2H71.0965V33.472C71.0965 34.816 70.2285 35.488 68.9825 35.488C67.7365 35.488 66.8825 34.816 66.8825 33.472V27.2H65.1325V33.458C65.1325 35.838 66.7005 37.112 68.9825 37.112ZM81.3753 34.382C81.3053 33.486 80.8713 32.758 80.1993 32.338C81.0113 31.918 81.5153 31.232 81.5153 30.224C81.5153 28.446 80.3113 27.2 78.2673 27.2H74.2493V37H76.1113V33.318H78.2253C78.9533 33.318 79.4713 33.85 79.5413 34.592L79.7793 37H81.6133L81.3753 34.382ZM78.1833 28.754C79.2753 28.754 79.7233 29.44 79.7233 30.224C79.7233 31.008 79.2753 31.722 78.1833 31.722H76.1113V28.754H78.1833ZM89.9169 37V35.39H85.0869V32.772H88.8389V31.176H85.0869V28.796H89.7629V27.2H83.2389V37H89.9169Z" fill="#FCFCFC"/>
              </svg>
            </div>
          )}

          {/* Tips */}
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
        </>
      )}
    </main>
  );
}
