"use client";

import dynamic from "next/dynamic";
import { HeroCountdown } from "@/components/home/HeroCountdown";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { StandingsSection } from "@/components/home/StandingsSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { Footer } from "@/components/layout/Footer";

const Hero3DSceneLazy = dynamic(
  () => import("@/components/home/Hero3DScene").then((mod) => mod.Hero3DScene),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-[#E8E6E1]">
      {/* 3D Car Persistent Across Entire Page */}
      <Hero3DSceneLazy />

      {/* Content Stream with Seamless Transparent / Translucent Layers */}
      <div className="relative z-10 flex flex-col">
        {/* 1. Direct Countdown Hero */}
        <HeroCountdown />

        {/* 2. Race Calendar */}
        <ScheduleSection />

        {/* 3. Real-time World Standings */}
        <StandingsSection />

        {/* 4. Marquee Strip */}
        <MarqueeStrip />

        {/* 5. Restored Beloved Old Footer with 3D Helmet */}
        <Footer />
      </div>
    </div>
  );
}
