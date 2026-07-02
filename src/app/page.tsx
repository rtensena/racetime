import { HeroAbout } from "@/components/home/HeroAbout";
import { HeroCountdown } from "@/components/home/HeroCountdown";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { StandingsSection } from "@/components/home/StandingsSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroAbout />
      <HeroCountdown />
      
      {/* Spacer to allow scrolling momentum from Hero */}
      <div className="h-32 bg-gradient-to-b from-background to-race-gray-2/20" />
      
      <div className="flex flex-col space-y-12">
        <ScheduleSection />
        <StandingsSection />
      </div>

      <div className="h-32" />
      
      <Footer />
    </div>
  );
}
