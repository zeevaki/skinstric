"use client";

import { useRouter } from "next/navigation";

interface Props {
  side?: "left" | "right" | "both";
  leftHref?: string;
  rightHref?: string;
  onRightHoverChange?: (hovered: boolean) => void;
  hideLeft?: boolean;
}

function DiamondArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <div className="nav-diamond-btn relative flex items-center justify-center w-11 h-11 shrink-0" style={{ transform: "rotate(45deg)" }}>
      <div className="absolute inset-0 border border-[#1a1a1a]" />
      <svg className="relative z-10" width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ transform: "rotate(-45deg)" }}>
        {direction === "left" ? (
          <polygon points="9,0 0,5.5 9,11" fill="currentColor" />
        ) : (
          <polygon points="0,0 9,5.5 0,11" fill="currentColor" />
        )}
      </svg>
    </div>
  );
}

export default function SideNav({ side = "both", leftHref, rightHref, onRightHoverChange, hideLeft = false }: Props) {
  const router = useRouter();

  return (
    <>
      {(side === "left" || side === "both") && (
        <div
          onClick={() => leftHref && router.push(leftHref)}
          className="absolute flex flex-col md:flex-row items-center gap-1 md:gap-4 z-[1] left-2 md:left-8 select-none"
          style={{ top: "calc(50vh - 21px)", cursor: leftHref ? "pointer" : "default", opacity: hideLeft ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: hideLeft ? "none" : undefined }}
        >
          <DiamondArrow direction="left" />
          <span className="text-[6px] tracking-[0.05em] md:text-[10px] md:tracking-[0.2em] font-medium uppercase text-[#1a1a1a] text-center">
            Discover A.I.
          </span>
        </div>
      )}

      {(side === "right" || side === "both") && (
        <div
          onClick={() => rightHref && router.push(rightHref)}
          onMouseEnter={() => onRightHoverChange?.(true)}
          onMouseLeave={() => onRightHoverChange?.(false)}
          className="absolute flex flex-col md:flex-row-reverse items-center gap-1 md:gap-4 z-[1] right-2 md:right-8 select-none"
          style={{ top: "calc(50vh - 21px)", cursor: rightHref ? "pointer" : "default" }}
        >
          <DiamondArrow direction="right" />
          <span className="text-[6px] tracking-[0.05em] md:text-[10px] md:tracking-[0.2em] font-medium uppercase text-[#1a1a1a] text-center">
            Take Test
          </span>
        </div>
      )}
    </>
  );
}
