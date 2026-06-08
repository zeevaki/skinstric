"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const modalBtnStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase",
  color: "#FCFCFC", background: "none", border: "none", cursor: "pointer",
};

function CameraPermissionModal({ onDeny, onAllow }: { onDeny: () => void; onAllow: () => void }) {
  return (
    <div className="absolute z-50 flex flex-col justify-between" style={{ left: 32, top: "46%", width: 432, height: 100, background: "#1A1B1C" }}>
      <p style={{ padding: "20px 24px 0", fontSize: 11, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FCFCFC", lineHeight: "18px" }}>
        Allow A.I. to access your camera
      </p>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "flex-end", gap: 24, padding: "10px 24px" }}>
        <button onClick={onDeny} style={{ ...modalBtnStyle, opacity: 0.6 }}>Deny</button>
        <button onClick={onAllow} style={modalBtnStyle}>Allow</button>
      </div>
    </div>
  );
}

/* Dashed diamond outline */
function DiamondOutline({ size }: { size: number }) {
  return (
    <div style={{
      width: size, height: size,
      border: "1.5px dashed #A0A4AB",
      transform: "rotate(45deg)",
      opacity: 0.5,
      flexShrink: 0,
    }} />
  );
}

/* Camera icon */
function CameraIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="39" stroke="#1A1B1C" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="33" fill="#1A1B1C" />
      <path fillRule="evenodd" clipRule="evenodd" d="M36.5 26.5C36.1 26.65 35 27.65 34.55 28.23C34.43 28.39 34.22 28.43 33.42 28.43C31.12 28.43 29.87 29.09 29.14 30.69L28.83 31.36V36.17C28.83 40.34 28.85 40.92 29.02 41.36C29.48 42.48 30.35 43.28 31.43 43.6C32.25 43.84 46.75 43.84 47.57 43.6C48.36 43.36 49.07 42.86 49.5 42.22C50.16 41.23 50.15 41.26 50.15 36.11V31.36L49.83 30.67C49.46 29.85 48.6 29.03 47.85 28.77C47.52 28.65 46.88 28.57 46.03 28.53L44.74 28.48L43.94 27.71C43.51 27.3 43.04 26.89 42.87 26.8C42.45 26.57 37.19 26.52 36.5 26.5ZM41.84 30.15C42 30.22 42.52 30.64 43 31.1L43.86 31.92L45.28 31.99C46.83 32.06 47.27 32.19 47.83 32.77C48.5 33.45 48.49 33.37 48.46 38.31L48.43 42.71L48.1 43.17C47.92 43.42 47.56 43.74 47.3 43.88L46.82 44.15H40H33.18L32.7 43.88C32.44 43.74 32.08 43.42 31.9 43.17L31.57 42.71L31.54 38.31C31.51 33.35 31.5 33.45 32.18 32.76C32.76 32.18 33.14 32.06 34.67 31.99L36.09 31.92L36.88 31.17C38.04 30.05 37.91 30.09 40.68 30.09C41.36 30.09 41.78 30.12 41.84 30.15ZM38.68 32.69C36.14 33.37 34.59 35.97 35.26 38.46C35.49 39.33 35.8 39.87 36.51 40.6C38.01 42.14 40.3 42.54 42.22 41.56C43 41.17 44.04 40.16 44.39 39.47C45.24 37.82 45.07 35.72 44 34.27C43.47 33.57 42.56 32.9 41.75 32.6C40.94 32.29 39.5 32.22 38.68 32.69Z" fill="#FCFCFC"/>
    </svg>
  );
}

/* Gallery icon */
function GalleryIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="39" stroke="#1A1B1C" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="33" fill="#FCFCFC" stroke="#1A1B1C" strokeWidth="1.5" />
      <circle cx="44" cy="34" r="7" fill="#1A1B1C" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22 40C22 43 22.5 45.8 23.4 48.4C26.8 57.5 35.6 64 46 64C58.15 64 68 54.15 68 42C68 29.85 58.15 20 46 20C33.85 20 24 29.85 24 42C24 43.1 24.1 44.18 24.27 45.23L22.3 46.53C22.1 44.4 22 42.2 22 40ZM25.6 46.8L24.4 47.6C24.9 49.7 25.7 51.7 26.7 53.5L46.5 42.5C47.9 41.7 48.6 41.2 48.5 41.3L36.8 33.5C34.1 31.6 30.5 31.5 27.7 33.3L25.6 46.8Z" fill="#1A1B1C"/>
    </svg>
  );
}

export default function SelectPage() {
  const router = useRouter();
  const galleryRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleGallerySelected = () => {
    sessionStorage.setItem("skinstric_method", "gallery");
    router.push("/analysis/processing");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Intro" />

      <p className="absolute z-[1] uppercase" style={{ top: 86, left: 32, fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.02em", color: "#1A1B1C" }}>
        To Start Analysis
      </p>

      {/* Hidden gallery input */}
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleGallerySelected} />

      {showCameraModal && (
        <CameraPermissionModal
          onDeny={() => setShowCameraModal(false)}
          onAllow={() => router.push("/analysis/camera")}
        />
      )}

      {/* Two options — centered */}
      <div className="absolute z-[1] flex flex-col sm:flex-row items-center justify-center" style={{ inset: 0, gap: "min(80px, 8vw)" }}>

        {/* Camera option */}
        <div onClick={() => setShowCameraModal(true)} className="relative flex items-center justify-center cursor-pointer select-none" style={{ width: "min(280px, 38vw)", height: "min(280px, 38vw)" }}>
          <DiamondOutline size={Math.min(320, 300)} />
          <div className="absolute flex flex-col items-center gap-3">
            <CameraIcon />
          </div>
          {/* Callout label */}
          <div className="absolute" style={{ top: "18%", left: "80%" }}>
            <div style={{ width: 1, height: 40, background: "#1A1B1C", marginLeft: 0 }} />
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#1A1B1C", whiteSpace: "nowrap", marginTop: 4 }}>
              Allow A.I.<br />to Scan Your Face
            </p>
          </div>
        </div>

        {/* Gallery option */}
        <div
          onClick={() => { sessionStorage.setItem("skinstric_method", "gallery"); galleryRef.current?.click(); }}
          className="relative flex items-center justify-center cursor-pointer select-none"
          style={{ width: "min(280px, 38vw)", height: "min(280px, 38vw)" }}
        >
          <DiamondOutline size={Math.min(320, 300)} />
          <div className="absolute flex flex-col items-center gap-3">
            <GalleryIcon />
          </div>
          {/* Callout label */}
          <div className="absolute" style={{ top: "18%", right: "80%" }}>
            <div style={{ width: 1, height: 40, background: "#1A1B1C", marginLeft: "auto" }} />
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#1A1B1C", whiteSpace: "nowrap", marginTop: 4, textAlign: "right" }}>
              Allow A.I.<br />Access Gallery
            </p>
          </div>
        </div>
      </div>

      {/* SELECT PREFERRED WAY — bottom center */}
      <div className="absolute z-[1] flex flex-col items-center gap-2" style={{ bottom: "18%", left: "50%", transform: "translateX(-50%)" }}>
        <div style={{ position: "relative", width: 24, height: 24 }}>
          <div style={{ position: "absolute", inset: 0, border: "1px dashed #A0A4AB", transform: "rotate(45deg)" }} />
          <div style={{ position: "absolute", width: 4, height: 4, background: "#A0A4AB", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.4, whiteSpace: "nowrap" }}>
          Select Preferred Way
        </p>
      </div>

      {/* BACK */}
      <div onClick={() => router.push("/analysis/location")} className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left" style={{ bottom: 48, left: 32 }}>
        <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><polygon points="9,0 0,5.5 9,11" fill="#1A1B1C" /></svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>
    </main>
  );
}
