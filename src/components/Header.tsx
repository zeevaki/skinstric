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

          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#1A1B1C", opacity: 0.6 }}>
            [ {section} ]
          </span>
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
