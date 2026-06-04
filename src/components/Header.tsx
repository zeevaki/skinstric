interface HeaderProps {
  showEnterCode?: boolean;
  section?: string;
}

export default function Header({ showEnterCode = true, section = "Intro" }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-[14px]">
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C" }}>
            Skinstric
          </span>

          <div className="flex items-center gap-[6px]" style={{ opacity: 0.6 }}>
            <div style={{ width: 4, height: 17, border: "1px solid #1A1B1C", borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C" }}>
              {section}
            </span>
            <div style={{ width: 4, height: 17, border: "1px solid #1A1B1C", borderRadius: 2, flexShrink: 0, transform: "scaleX(-1)" }} />
          </div>
        </div>

        {showEnterCode && (
          <button
            className="cursor-pointer"
            style={{ background: "#1A1B1C", color: "#FCFCFC", padding: "8px 16px", fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase" }}
          >
            Enter Code
          </button>
        )}
      </div>
    </header>
  );
}
