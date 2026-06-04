"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntroduceInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    const name = value.trim();
    if (!name) return;
    sessionStorage.setItem("skinstric_name", name);
    router.push("/analysis/location");
  };

  return (
    <div
      className="absolute z-[1] flex flex-col items-center"
      style={{ left: "50%", top: "44vh", transform: "translateX(-50%)" }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "24px",
          textTransform: "uppercase",
          color: "#1A1B1C",
          opacity: focused || value ? 0 : 0.4,
          transition: "opacity 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        Click to type
      </p>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Introduce Yourself"
        className="bg-transparent outline-none border-b border-[#1A1B1C] text-center text-[#1A1B1C] placeholder:text-[#1A1B1C]"
        style={{
          fontSize: "min(3.75rem, 6vmin)",
          fontWeight: 400,
          letterSpacing: "-0.07em",
          width: "min(488px, 51vmin)",
          marginTop: 4,
        }}
      />
    </div>
  );
}
