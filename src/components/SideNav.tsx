"use client";

import { useRouter } from "next/navigation";

interface Props {
  side?: "left" | "right" | "both";
  leftHref?: string;
  rightHref?: string;
}

function DiamondArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <div className="relative flex items-center justify-center w-6 h-6 md:w-11 md:h-11 shrink-0">
      <div className="absolute w-3.5 h-3.5 md:w-7 md:h-7 rotate-45 border border-[#1a1a1a]" />
      <svg className="relative z-10" width="7" height="7" viewBox="0 0 10 10" fill="none">
        {direction === "left" ? (
          <polyline points="7,1 3,5 7,9" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="square" />
        ) : (
          <polyline points="3,1 7,5 3,9" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="square" />
        )}
      </svg>
    </div>
  );
}

export default function SideNav({ side = "both", leftHref, rightHref }: Props) {
  const router = useRouter();

  return (
    <>
      {(side === "left" || side === "both") && (
        <div
          onClick={() => leftHref && router.push(leftHref)}
          className="absolute flex flex-col md:flex-row items-center gap-1 md:gap-4 z-[1] left-2 md:left-8 select-none"
          style={{ top: "calc(50vh - 21px)", cursor: leftHref ? "pointer" : "default" }}
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
