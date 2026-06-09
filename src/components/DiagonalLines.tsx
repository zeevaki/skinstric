interface Props {
  side?: "left" | "right" | "both";
  hideLeft?: boolean;
}

const diamondStyle = (pos: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  width: "30vw",
  height: "30vw",
  top: "calc(50vh - 15vw)",
  [pos]: "-15vw",
  border: "2px dashed #A0A4AB",
  transform: "rotate(45deg)",
  transition: "opacity 0.4s ease",
});

export default function DiagonalLines({ side = "both", hideLeft = false }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {(side === "left" || side === "both") && (
        <div style={{ ...diamondStyle("left"), opacity: hideLeft ? 0 : 1 }} />
      )}
      {(side === "right" || side === "both") && <div style={diamondStyle("right")} />}
    </div>
  );
}
