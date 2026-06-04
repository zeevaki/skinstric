import Header from "@/components/Header";
import DiagonalLines from "@/components/DiagonalLines";
import SideNav from "@/components/SideNav";
import DescriptionText from "@/components/DescriptionText";

export default function IntroPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Header />
      <DiagonalLines side="right" />
      <SideNav side="right" rightHref="/analysis" />
      <DescriptionText />

      {/* Hero text — left-aligned */}
      <div className="absolute inset-0 flex items-center z-[1] px-8 md:px-[32px] pointer-events-none">
        <h1 className="text-[clamp(2rem,8vw,7rem)] font-[300] leading-[1.1] tracking-tight text-left text-[#1a1a1a]">
          Sophisticated<br />skincare
        </h1>
      </div>
    </main>
  );
}
