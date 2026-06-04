export default function DescriptionText() {
  return (
    <p
      className="desc-text absolute z-[1] uppercase text-[#1A1B1C]"
      style={{
        left: "clamp(16px, 10vw, 120px)",
        bottom: "13.5vh",
        width: "min(316px, 80vw)",
        fontSize: "clamp(11px, 1vw, 13px)",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: 0,
      }}
    >
      Skinstric developed an A.I. that creates
      <br />a highly-personalised routine tailored to
      <br />what your skin needs.
    </p>
  );
}
