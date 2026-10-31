"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeroAbout() {
  const [sessionTime, setSessionTime] = useState("");

  useEffect(() => {
    const updateUtc = () => {
      const d = new Date();
      setSessionTime(d.toUTCString().slice(17, 25) + " UTC");
    };
    updateUtc();
    const interval = setInterval(updateUtc, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full border-b border-[#3A3A35] bg-[#1A1A17] text-[#E8E6E1]">
      {/* Top telemetry ticker strip */}
      <div className="border-b border-[#3A3A35] bg-[#232320] px-4 md:px-8 py-2 font-mono text-[11px] text-[#78766F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#22C55E]">
            <span className="w-2 h-2 bg-[#22C55E]" />
            LIVE TELEMETRY FEED
          </span>
          <span className="hidden sm:inline text-[#3A3A35]">|</span>
          <span className="hidden sm:inline">REG: 2026 POWER UNIT ARCHITECTURE</span>
          <span className="hidden md:inline text-[#3A3A35]">|</span>
          <span className="hidden md:inline">SUSTAINABLE FUEL 100% // MGU-K 350KW</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span>SYS CLK: <span className="text-[#E8E6E1]">{sessionTime || "00:00:00 UTC"}</span></span>
          <span className="border border-[#3A3A35] px-1.5 py-0.5 text-[#E8462E]">TRACK COND: DRY</span>
        </div>
      </div>

      {/* Main Pit Wall Grid: Asymmetric 12-column engineering layout */}
      <div className="max-w-[80rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (Cols 1-7): Big Display & Mission */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E8462E] tracking-widest uppercase mb-4">
              <span className="w-2 h-2 bg-[#E8462E]" />
              ENGINEERING & TIMING DISPATCH
            </div>

            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.9] text-[#E8E6E1] mb-6">
              RACETIME <br />
              <span className="text-[#78766F]">2026 WORLD</span> <br />
              <span className="text-[#E8462E]">CHAMPIONSHIP</span>
            </h1>

            <p className="font-mono text-xs sm:text-sm text-[#78766F] max-w-xl leading-relaxed mb-8">
              PRECISION & SPEED — Your pit wall monitor for the 2026 Formula One season. Real-time sector differentials, session timelines, championship delta analysis, and official calendar tracking.
            </p>

            {/* Direct quick action */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <a
                href="#schedule"
                className="bg-[#E8462E] hover:bg-[#FF5438] text-white px-5 py-3 font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>OPEN RACE CALENDAR</span>
                <span>→</span>
              </a>
              <a
                href="#standings"
                className="border border-[#3A3A35] hover:border-[#E8E6E1] bg-[#232320] text-[#E8E6E1] px-5 py-3 uppercase tracking-wider transition-colors"
              >
                WDC & WCC STANDINGS
              </a>
            </div>
          </div>

          {/* Right Column (Cols 8-12): Timing Monitor Sidebar */}
          <div className="lg:col-span-5 border border-[#3A3A35] bg-[#232320] divide-y divide-[#3A3A35]">
            {/* Panel Title */}
            <div className="p-4 flex items-center justify-between font-mono text-xs bg-[#1A1A17]">
              <span className="text-[#E8E6E1] font-bold tracking-wider">CHAMPIONSHIP METRICS</span>
              <span className="text-[#78766F]">DOC // RT-2026-01</span>
            </div>

            {/* Metric Rows */}
            <div className="p-4 grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-[10px] text-[#78766F] uppercase block">GRAND PRIX ROUNDS</span>
                <span className="text-3xl font-display font-black text-[#E8E6E1] tracking-tight">24</span>
                <span className="text-[10px] text-[#78766F] block mt-0.5">5 CONTINENTS</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78766F] uppercase block">SEASON HERITAGE</span>
                <span className="text-3xl font-display font-black text-[#E8E6E1] tracking-tight">76TH</span>
                <span className="text-[10px] text-[#78766F] block mt-0.5">EST. 1950 FIA</span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-[10px] text-[#78766F] uppercase block">TEAMS ON GRID</span>
                <span className="text-3xl font-display font-black text-[#E8E6E1] tracking-tight">10</span>
                <span className="text-[10px] text-[#78766F] block mt-0.5">CONSTRUCTORS</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78766F] uppercase block">ACTIVE DRIVERS</span>
                <span className="text-3xl font-display font-black text-[#E8E6E1] tracking-tight">20</span>
                <span className="text-[10px] text-[#78766F] block mt-0.5">GRID SEATS</span>
              </div>
            </div>

            {/* Sector benchmark */}
            <div className="p-4 font-mono text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-[#78766F] uppercase">TELEMETRY BENCHMARK</span>
                <span className="text-[10px] text-[#A855F7] font-bold">FASTEST SECTOR</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] tabular-nums">
                <div className="border border-[#3A3A35] bg-[#1A1A17] p-2">
                  <span className="block text-[9px] text-[#78766F]">SEC 1</span>
                  <span className="text-[#A855F7] font-bold">27.412</span>
                </div>
                <div className="border border-[#3A3A35] bg-[#1A1A17] p-2">
                  <span className="block text-[9px] text-[#78766F]">SEC 2</span>
                  <span className="text-[#22C55E] font-bold">38.905</span>
                </div>
                <div className="border border-[#3A3A35] bg-[#1A1A17] p-2">
                  <span className="block text-[9px] text-[#78766F]">SEC 3</span>
                  <span className="text-[#E8462E] font-bold">24.118</span>
                </div>
              </div>
            </div>

            {/* Scroll instruction in race-engineer voice */}
            <div className="p-4 font-mono text-[11px] text-[#78766F] flex items-center justify-between bg-[#1A1A17]">
              <span>SCROLL TO START THE ENGINE</span>
              <span className="text-[#E8462E] font-bold">↓ TELEMETRY</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
