"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const modalBtnStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase",
  color: "#FCFCFC", background: "none", border: "none", cursor: "pointer",
};

const D = "min(482px, 33vw)"; // outer diamond size

function SpinningDiamonds() {
  return (
    <>
      <div className="diamond-slow-a" style={{ position: "absolute", inset: 0,  border: "1.5px dashed #A0A4AB", opacity: 0.3 }} />
      <div className="diamond-slow-b" style={{ position: "absolute", inset: "4%", border: "1.5px dashed #A0A4AB", opacity: 0.6 }} />
      <div className="diamond-slow-c" style={{ position: "absolute", inset: "8%", border: "1.5px dashed #A0A4AB" }} />
    </>
  );
}

function CameraPermissionModal({ onDeny, onAllow }: { onDeny: () => void; onAllow: () => void }) {
  return (
    <div className="absolute z-50 flex flex-col justify-between"
      style={{ left: "25%", top: "58%", width: 432, height: 100, background: "#1A1B1C", transform: "translateX(-50%)" }}>
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

export default function SelectPage() {
  const router = useRouter();
  const galleryRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleGallerySelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      try { sessionStorage.setItem("skinstric_image", dataUrl); } catch { /* too large */ }
      sessionStorage.setItem("skinstric_method", "gallery");
      router.push("/analysis/processing");
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "#FCFCFC" }}>
      <Header showEnterCode={false} section="Intro" />

      <p className="absolute z-[1] uppercase" style={{ top: 86, left: 32, fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.02em", color: "#1A1B1C" }}>
        To Start Analysis
      </p>

      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleGallerySelected} />
      {showCameraModal && <CameraPermissionModal onDeny={() => setShowCameraModal(false)} onAllow={() => router.push("/analysis/camera")} />}

      {/* ── Camera ── */}
      <div onClick={() => setShowCameraModal(true)} className="absolute z-[1] cursor-pointer select-none"
        style={{ left: "25%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "relative", width: D, height: D }}>
          <SpinningDiamonds />
          {/* Icon */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <svg width="116" height="116" viewBox="185 185 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="242" cy="242" r="57.7857" stroke="#1A1B1C"/>
              <circle cx="242" cy="242" r="51" fill="#1A1B1C"/>
              <path d="M274.668 209.412C266.315 201.038 254.763 195.857 242 195.857C239.047 195.857 236.158 196.134 233.359 196.665C238.134 204.563 255.58 232.255 258.941 237.18C259.593 238.137 260.753 236.236 267.778 222.693L274.668 209.412Z" fill="#FCFCFC"/>
              <path d="M199.088 225.004C204.582 211.146 216.594 200.582 231.341 197.094C233.087 199.713 236.422 204.887 240.067 210.649L249.327 225.291H222.886C210.126 225.291 202.669 225.208 199.088 225.004Z" fill="#FCFCFC"/>
              <path d="M205.869 270.703C199.602 262.825 195.857 252.85 195.857 242C195.857 236.801 196.717 231.803 198.302 227.14H213.167C230.552 227.14 230.948 227.167 230.327 228.329C229.095 230.634 210.824 262.262 205.869 270.703Z" fill="#FCFCFC"/>
              <path d="M250.964 287.273C248.065 287.843 245.067 288.143 242 288.143C228.192 288.143 215.8 282.077 207.344 272.465C209.171 268.405 213.929 259.932 222.172 246.011C222.947 244.701 223.732 243.781 223.917 243.966C224.102 244.15 230.604 254.52 238.367 267.008L250.964 287.273Z" fill="#FCFCFC"/>
              <path d="M285.529 257.348C280.372 271.973 268.053 283.22 252.784 286.876C248.578 280.389 234.612 257.956 234.612 257.609C234.612 257.466 246.681 257.348 261.433 257.348H285.529Z" fill="#FCFCFC"/>
              <path d="M275.902 210.697C283.5 218.922 288.143 229.919 288.143 242C288.143 246.923 287.372 251.666 285.944 256.115H270.596C260.624 256.115 252.465 255.965 252.465 255.78C252.465 255.4 272.437 217.016 275.902 210.697Z" fill="#FCFCFC"/>
            </svg>
          </div>
          {/* Label */}
          <div style={{ position: "absolute", top: "18%", left: "62%" }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position: "absolute", bottom: -8, left: -52 }}>
              <line x1="0" y1="56" x2="50" y2="6" stroke="#1A1B1C" strokeWidth="0.8"/>
              <circle cx="50" cy="6" r="2" fill="#1A1B1C"/>
            </svg>
            <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#1A1B1C", lineHeight: "18px", whiteSpace: "nowrap" }}>
              Allow A.I.<br />To Scan Your Face
            </p>
          </div>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div onClick={() => { sessionStorage.setItem("skinstric_method", "gallery"); galleryRef.current?.click(); }}
        className="absolute z-[1] cursor-pointer select-none"
        style={{ left: "72%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "relative", width: D, height: D }}>
          <SpinningDiamonds />
          {/* Icon */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <svg width="116" height="116" viewBox="190 185 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="247" cy="242" r="57.7857" stroke="#1A1B1C"/>
              <circle cx="247" cy="242" r="50" fill="#FCFCFC" stroke="#1A1B1C" strokeWidth="2"/>
              <path d="M257.321 242C264.363 242 270.071 236.292 270.071 229.25C270.071 222.208 264.363 216.5 257.321 216.5C250.28 216.5 244.571 222.208 244.571 229.25C244.571 236.292 250.28 242 257.321 242Z" fill="#1A1B1C"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M196 242C196 245.96 196.451 249.815 197.306 253.516C202.527 276.136 222.794 293 247 293C273.867 293 295.882 272.224 297.856 245.862C297.951 244.587 298 243.299 298 242C298 213.833 275.167 191 247 191C218.833 191 196 213.833 196 242ZM214.336 241.726L198.382 252.771C197.618 249.302 197.214 245.698 197.214 242C197.214 214.504 219.504 192.214 247 192.214C274.496 192.214 296.786 214.504 296.786 242C296.786 243.541 296.716 245.066 296.579 246.572L261.945 265.813C259.432 267.208 256.334 266.997 254.035 265.272L222.855 241.887C220.346 240.006 216.915 239.941 214.336 241.726Z" fill="#1A1B1C"/>
            </svg>
          </div>
          {/* Label */}
          <div style={{ position: "absolute", top: "62%", left: "14%" }}>
            <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#1A1B1C", lineHeight: "18px", whiteSpace: "nowrap" }}>
              Allow A.I.<br />Access Gallery
            </p>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position: "absolute", top: -8, right: -52 }}>
              <line x1="56" y1="56" x2="6" y2="6" stroke="#1A1B1C" strokeWidth="0.8"/>
              <circle cx="6" cy="6" r="2" fill="#1A1B1C"/>
            </svg>
          </div>
        </div>
      </div>

      {/* SELECT PREFERRED WAY */}
      <div className="absolute z-[1] flex flex-col items-center gap-2" style={{ left: "50%", top: "75%", transform: "translateX(-50%)" }}>
        <div style={{ position: "relative", width: 24, height: 24 }}>
          <div style={{ position: "absolute", inset: 0, border: "1px dashed #A0A4AB", transform: "rotate(45deg)" }} />
          <div style={{ position: "absolute", width: 4, height: 4, background: "#A0A4AB", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.4, whiteSpace: "nowrap" }}>
          Select Preferred Way
        </p>
      </div>

      {/* BACK */}
      <div onClick={() => router.push("/analysis/location")}
        className="absolute z-[1] flex items-center gap-4 cursor-pointer select-none nav-btn-bottom nav-btn-left"
        style={{ bottom: 48, left: 32 }}>
        <div className="nav-diamond-btn flex items-center justify-center shrink-0" style={{ width: 44, height: 44, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
            <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.7 }}>Back</span>
      </div>
    </main>
  );
}
