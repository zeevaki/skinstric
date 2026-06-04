import Header from "@/components/Header";
import DiagonalLines from "@/components/DiagonalLines";
import SideNav from "@/components/SideNav";
import CenterHoldButton from "@/components/CenterHoldButton";
import DescriptionText from "@/components/DescriptionText";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <DiagonalLines />
      <Header />

      <SideNav />
      <CenterHoldButton />
      <DescriptionText />

      {/* Hero text */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
        <h1 className="text-[clamp(2rem,8vw,7rem)] font-[300] leading-[1.1] tracking-tight text-center text-[#1a1a1a] px-6 md:px-0 w-full">
          Sophisticated<br />skincare
        </h1>
      </div>
    </main>
  );
}
