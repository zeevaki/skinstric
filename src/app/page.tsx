"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DiagonalLines from "@/components/DiagonalLines";
import SideNav from "@/components/SideNav";
import CenterHoldButton from "@/components/CenterHoldButton";
import DescriptionText from "@/components/DescriptionText";

export default function Home() {
  const [takeTestHovered, setTakeTestHovered] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <DiagonalLines hideLeft={takeTestHovered} />
      <Header />

      <SideNav rightHref="/analysis" onRightHoverChange={setTakeTestHovered} hideLeft={takeTestHovered} />
      <CenterHoldButton />
      <DescriptionText />

      {/* Hero text */}
      <h1
        className="text-[clamp(2rem,8vw,7rem)] font-[300] leading-[1.1] tracking-tight text-[#1a1a1a] absolute z-[1] pointer-events-none"
        style={{
          top: "50%",
          left: takeTestHovered ? "clamp(32px, 8vw, 112px)" : "50%",
          transform: takeTestHovered ? "translateY(-50%)" : "translate(-50%, -50%)",
          transition: "left 0.6s ease, transform 0.6s ease",
        }}
      >
        Sophisticated<br />skincare
      </h1>
    </main>
  );
}
