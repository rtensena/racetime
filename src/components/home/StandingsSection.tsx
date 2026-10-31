"use client";

import { useState, useMemo, useRef } from "react";
import { useDriverStandings, useConstructorStandings } from "@/hooks/useF1Data";
import { DriverStanding, ConstructorStanding } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const teamColors: Record<string, string> = {
  "red bull": "#3671C6",
  "ferrari": "#E8002D",
  "mclaren": "#FF8000",
  "mercedes": "#27F4D2",
  "aston martin": "#229971",
  "alpine": "#0093CC",
  "williams": "#64C4FF",
  "rb": "#6692FF",
  "racing bulls": "#6692FF",
  "sauber": "#52E252",
  "kick sauber": "#52E252",
  "haas": "#B6BABD",
  "audi": "#52E252",
};

function getTeamColor(teamName: string = ""): string {
  const clean = teamName.toLowerCase();
  for (const [key, color] of Object.entries(teamColors)) {
    if (clean.includes(key)) return color;
  }
  return "#78766F";
}

export function StandingsSection() {
  const [category, setCategory] = useState<"DRIVERS" | "CONSTRUCTORS">("DRIVERS");

  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // 100% Real-time dynamic fetch of current season standings from free Ergast API
  const {
    data: drivers = [],
    isLoading: isLoadingDrivers,
    isError: isErrorDrivers,
    refetch: refetchDrivers,
    dataUpdatedAt: driversUpdatedAt,
  } = useDriverStandings("current");

  const {
    data: constructors = [],
    isLoading: isLoadingConstructors,
    isError: isErrorConstructors,
    refetch: refetchConstructors,
    dataUpdatedAt: constructorsUpdatedAt,
  } = useConstructorStandings("current");

  const isLoading = category === "DRIVERS" ? isLoadingDrivers : isLoadingConstructors;
  const isError = category === "DRIVERS" ? isErrorDrivers : isErrorConstructors;
  const lastUpdated = category === "DRIVERS" ? driversUpdatedAt : constructorsUpdatedAt;

  const currentYear = new Date().getFullYear();
  const driverLeaderPoints = drivers[0]?.points || 0;
  const constructorLeaderPoints = constructors[0]?.points || 0;

  // Entrance motion
  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );

    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      id="standings"
      ref={containerRef}
      className="relative w-full bg-[#0D0D0C]/85 backdrop-blur-sm text-[#E8E6E1] py-20 md:py-28 border-b border-white/10"
    >
      <span id="drivers" className="relative -top-24 block" />

      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-10 gap-6">
          <div>
            <div className="font-mono text-xs text-[#E8462E] uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E8462E] animate-pulse" />
              LIVE {currentYear} WORLD CHAMPIONSHIP CLASSIFICATION
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
              WORLD <span className="text-[#E8462E]">STANDINGS</span>
            </h2>
            <div className="flex items-center gap-3 font-mono text-xs text-white/50 mt-2">
              <span>REAL-TIME ERGAST MOTORSPORT API</span>
              <span>•</span>
              <span>AUTO-SYNCHRONIZED</span>
              {lastUpdated > 0 && (
                <>
                  <span>•</span>
                  <span className="text-[#22C55E]">LAST SYNC: {new Date(lastUpdated).toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>

          {/* Drivers / Constructors Segmented Toggle */}
          <div className="flex border border-white/15 bg-[#171715] font-mono text-xs">
            {(["DRIVERS", "CONSTRUCTORS"] as const).map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 uppercase tracking-wider font-bold transition-colors ${
                    isSelected
                      ? "bg-[#E8462E] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="border border-white/10 bg-[#171715] p-6 space-y-3 font-mono animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-white/5 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="border border-[#E8462E] bg-[#171715] p-8 text-center font-mono">
            <span className="text-[#E8462E] text-xs font-bold uppercase tracking-widest block mb-2">
              LIVE TELEMETRY FEED TEMPORARILY BUSY
            </span>
            <p className="text-sm text-white/50 mb-4">
              Connecting to Ergast F1 server...
            </p>
            <button
              onClick={() => (category === "DRIVERS" ? refetchDrivers() : refetchConstructors())}
              className="border border-[#E8462E] text-[#E8462E] hover:bg-[#E8462E] hover:text-white px-5 py-2.5 text-xs font-bold uppercase transition-colors"
            >
              RETRY TELEMETRY FETCH
            </button>
          </div>
        )}

        {/* Live Timing Tower Table */}
        {!isLoading && !isError && (
          <div ref={tableRef} className="border border-white/10 bg-[#0D0D0C] overflow-x-auto shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {category === "DRIVERS" ? (
                  <table className="w-full text-left font-mono border-collapse" aria-label="Drivers Championship Standings">
                    <thead>
                      <tr className="bg-[#171715] border-b border-white/10 text-[10px] text-white/40 uppercase tracking-wider">
                        <th scope="col" className="py-3.5 px-4 w-14 text-center">POS</th>
                        <th scope="col" className="py-3.5 px-1 w-2 text-center" aria-label="Team Colour" />
                        <th scope="col" className="py-3.5 px-3 w-16">CODE</th>
                        <th scope="col" className="py-3.5 px-4">DRIVER / CONSTRUCTOR</th>
                        <th scope="col" className="py-3.5 px-4 text-right">POINTS</th>
                        <th scope="col" className="py-3.5 px-4 text-right hidden sm:table-cell">GAP</th>
                        <th scope="col" className="py-3.5 px-4 text-right hidden md:table-cell">WINS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {drivers.map((d, idx) => {
                        const pos = d.position || idx + 1;
                        const code = d.code || d.lastName?.slice(0, 3).toUpperCase() || "DRV";
                        const color = getTeamColor(d.team);
                        const gap = pos === 1 ? "LEADER" : `-${(driverLeaderPoints - d.points).toFixed(0)}`;
                        const isLeader = pos === 1;

                        return (
                          <tr
                            key={d.driverId || idx}
                            className={`hover:bg-white/[0.04] transition-colors ${
                              isLeader ? "bg-[#171715]/70" : ""
                            }`}
                          >
                            <td className="py-4 px-4 text-center tabular-nums">
                              <span
                                className={`font-display font-black text-xl sm:text-2xl leading-none ${
                                  isLeader ? "text-[#E8462E]" : pos <= 3 ? "text-white" : "text-white/40"
                                }`}
                              >
                                {String(pos).padStart(2, "0")}
                              </span>
                            </td>

                            <td className="py-4 px-1 text-center">
                              <span
                                className="inline-block w-1.5 h-8"
                                style={{ backgroundColor: color }}
                                title={d.team}
                              />
                            </td>

                            <td className="py-4 px-3 font-bold text-xs sm:text-sm text-white">
                              <span className="border border-white/15 bg-[#171715] px-2 py-0.5 inline-block text-[11px] font-bold">
                                {code}
                              </span>
                            </td>

                            <td className="py-4 px-4 min-w-[160px]">
                              <div className="flex flex-col">
                                <span className="font-display font-bold text-lg sm:text-xl uppercase text-white leading-tight">
                                  <span className="text-white/40 font-normal mr-1">{d.firstName}</span>
                                  {d.lastName}
                                </span>
                                <span className="text-xs text-white/50 uppercase mt-0.5">
                                  {d.team}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-right tabular-nums">
                              <span className="font-display font-black text-2xl sm:text-3xl text-white">
                                {d.points}
                              </span>
                              <span className="text-[10px] text-white/40 block sm:hidden">PTS</span>
                            </td>

                            <td className="py-4 px-4 text-right text-xs tabular-nums text-white/50 hidden sm:table-cell">
                              {gap}
                            </td>

                            <td className="py-4 px-4 text-right text-xs tabular-nums text-white/50 hidden md:table-cell">
                              {d.wins > 0 ? (
                                <span className="text-white font-bold">{d.wins}</span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left font-mono border-collapse" aria-label="Constructors Championship Standings">
                    <thead>
                      <tr className="bg-[#171715] border-b border-white/10 text-[10px] text-white/40 uppercase tracking-wider">
                        <th scope="col" className="py-3.5 px-4 w-14 text-center">POS</th>
                        <th scope="col" className="py-3.5 px-1 w-2 text-center" aria-label="Team Colour" />
                        <th scope="col" className="py-3.5 px-4">CONSTRUCTOR</th>
                        <th scope="col" className="py-3.5 px-4 text-right">POINTS</th>
                        <th scope="col" className="py-3.5 px-4 text-right hidden sm:table-cell">GAP</th>
                        <th scope="col" className="py-3.5 px-4 text-right hidden md:table-cell">WINS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {constructors.map((c, idx) => {
                        const pos = c.position || idx + 1;
                        const color = getTeamColor(c.name);
                        const gap = pos === 1 ? "LEADER" : `-${(constructorLeaderPoints - c.points).toFixed(0)}`;

                        return (
                          <tr
                            key={c.teamId || idx}
                            className={`hover:bg-white/[0.04] transition-colors ${
                              pos === 1 ? "bg-[#171715]/70" : ""
                            }`}
                          >
                            <td className="py-4 px-4 text-center tabular-nums">
                              <span
                                className={`font-display font-black text-xl sm:text-2xl leading-none ${
                                  pos === 1 ? "text-[#E8462E]" : "text-white/40"
                                }`}
                              >
                                {String(pos).padStart(2, "0")}
                              </span>
                            </td>

                            <td className="py-4 px-1 text-center">
                              <span
                                className="inline-block w-1.5 h-8"
                                style={{ backgroundColor: color }}
                                title={c.name}
                              />
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-display font-bold text-lg sm:text-2xl uppercase text-white">
                                {c.name}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right tabular-nums">
                              <span className="font-display font-black text-2xl sm:text-3xl text-white">
                                {c.points}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right text-xs tabular-nums text-white/50 hidden sm:table-cell">
                              {gap}
                            </td>

                            <td className="py-4 px-4 text-right text-xs tabular-nums text-white/50 hidden md:table-cell">
                              {c.wins > 0 ? (
                                <span className="text-white font-bold">{c.wins}</span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
