"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSchedule } from "@/hooks/useF1Data";
import { mockGrandPrix } from "@/lib/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrackMap } from "@/components/ui/TrackMap";
import { CircuitSvg } from "@/components/ui/CircuitSvg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function ScheduleSection() {
  const containerRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [search, setSearch] = useState("");
  const [hoveredCircuit, setHoveredCircuit] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "FINISHED">("ALL");

  const { data: rawSchedule, isLoading, isError, refetch } = useSchedule("2026");

  const schedule = useMemo(() => {
    return rawSchedule && rawSchedule.length > 0 ? rawSchedule : mockGrandPrix;
  }, [rawSchedule]);

  // Find next upcoming race
  const nextRaceId = useMemo(() => {
    const nowTime = Date.now();
    const upcoming = schedule.find((gp) => new Date(gp.date).getTime() > nowTime);
    return upcoming ? upcoming.id : null;
  }, [schedule]);

  const filteredGPs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return schedule.filter((gp) => {
      const matchSearch =
        q === "" ||
        gp.name.toLowerCase().includes(q) ||
        gp.country.toLowerCase().includes(q) ||
        gp.circuit.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "UPCOMING" && gp.status !== "Finished") ||
        (statusFilter === "FINISHED" && gp.status === "Finished");

      return matchSearch && matchStatus;
    });
  }, [schedule, search, statusFilter]);

  const activeGP = useMemo(() => {
    return filteredGPs.find((gp) => gp.circuit === hoveredCircuit);
  }, [filteredGPs, hoveredCircuit]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // GSAP Staggered ScrollTrigger animation for rows
  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion || isLoading) return;

    rowsRef.current.forEach((row, idx) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, { scope: containerRef, dependencies: [filteredGPs, isLoading] });

  return (
    <section
      id="schedule"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#0D0D0C]/85 backdrop-blur-sm text-[#E8E6E1] py-20 md:py-28 border-b border-white/10"
    >
      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-10 gap-6">
          <div>
            <div className="font-mono text-xs text-[#E8462E] uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E8462E] animate-pulse" />
              OFFICIAL 2026 WORLD CHAMPIONSHIP CALENDAR
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
              RACE <span className="text-[#E8462E]">CALENDAR</span>
            </h2>
            <p className="font-mono text-xs text-white/50 mt-2 max-w-xl">
              24 Grand Prix rounds with interactive 3D track telemetry, sector blueprints, and local session timestamps.
            </p>
          </div>

          {/* Controls: Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono text-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH GRAND PRIX..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#171715] border border-white/10 focus:border-[#E8462E] text-white placeholder-white/30 px-3 py-2 text-xs uppercase tracking-wider w-full sm:w-56 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex border border-white/10 bg-[#171715]">
              {(["ALL", "UPCOMING", "FINISHED"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-2 uppercase tracking-wider transition-colors ${
                    statusFilter === filter
                      ? "bg-[#E8462E] text-white font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="border border-white/10 bg-[#171715] divide-y divide-white/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10" />
                  <div className="space-y-2">
                    <div className="w-48 h-5 bg-white/10" />
                    <div className="w-32 h-3 bg-white/5" />
                  </div>
                </div>
                <div className="w-24 h-4 bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="border border-[#E8462E] bg-[#171715] p-8 text-center font-mono">
            <span className="text-[#E8462E] text-xs font-bold uppercase tracking-widest block mb-2">
              SCHEDULE SYNCHRONIZATION ERROR
            </span>
            <p className="text-sm text-white/50 mb-4">
              Failed to connect to F1 Ergast API. Local calendar cache loaded.
            </p>
            <button
              onClick={() => refetch()}
              className="border border-[#E8462E] text-[#E8462E] hover:bg-[#E8462E] hover:text-white px-4 py-2 text-xs font-bold uppercase transition-colors"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {/* Schedule List */}
        {!isLoading && !isError && (
          <div
            className="border border-white/10 bg-[#0D0D0C]"
            onMouseLeave={() => setHoveredCircuit(null)}
          >
            {/* Table Header Strip */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#171715] border-b border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-wider">
              <div className="col-span-2">RND // STATUS</div>
              <div className="col-span-5">GRAND PRIX // CIRCUIT</div>
              <div className="col-span-2 text-center">BLUEPRINT</div>
              <div className="col-span-3 text-right">DATE // LOCAL TIME</div>
            </div>

            {filteredGPs.length > 0 ? (
              <div className="divide-y divide-white/10">
                {filteredGPs.map((gp, i) => {
                  const roundNum = schedule.findIndex((g) => g.id === gp.id) + 1;
                  const formattedRound = String(roundNum > 0 ? roundNum : i + 1).padStart(2, "0");
                  const isNext = gp.id === nextRaceId;
                  const isFinished = gp.status === "Finished";
                  const raceDate = new Date(gp.date);

                  return (
                    <div
                      key={gp.id}
                      ref={(el) => {
                        rowsRef.current[i] = el;
                      }}
                      className={cn(
                        "group transition-colors font-mono relative overflow-hidden",
                        isNext ? "bg-[#171715] border-l-4 border-l-[#E8462E]" : "hover:bg-white/[0.04]",
                        isFinished && "opacity-70 hover:opacity-100"
                      )}
                      onMouseEnter={() => {
                        if (typeof window !== "undefined" && window.innerWidth >= 768) {
                          setHoveredCircuit(gp.circuit);
                        }
                      }}
                    >
                      <Link
                        href={`/schedule/${gp.id}`}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 sm:p-6"
                      >
                        {/* Round Number & Status */}
                        <div className="md:col-span-2 flex items-center gap-3">
                          <span
                            className={cn(
                              "font-display font-black text-3xl sm:text-4xl tabular-nums tracking-tight",
                              isNext ? "text-[#E8462E]" : isFinished ? "text-white/30" : "text-white/60 group-hover:text-white"
                            )}
                          >
                            {formattedRound}
                          </span>
                          <div className="flex flex-col gap-1">
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 border font-bold uppercase tracking-wider w-fit",
                                isNext
                                  ? "border-[#E8462E] bg-[#E8462E] text-white"
                                  : isFinished
                                  ? "border-white/10 text-white/40"
                                  : "border-white/20 text-white/80"
                              )}
                            >
                              {isNext ? "NEXT UP" : gp.status}
                            </span>
                            {gp.isSprintWeekend && (
                              <span className="text-[9px] text-[#E8462E] border border-[#E8462E]/40 px-1 font-bold uppercase w-fit">
                                SPRINT
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Grand Prix & Circuit */}
                        <div className="md:col-span-5 min-w-0">
                          <h3
                            className={cn(
                              "font-display font-bold text-xl sm:text-2xl uppercase tracking-wide truncate transition-colors",
                              isNext ? "text-[#E8462E]" : "text-white group-hover:text-[#E8462E]"
                            )}
                          >
                            {gp.name.replace("Grand Prix", "").trim()} GP
                          </h3>
                          <p className="text-xs text-white/50 truncate uppercase mt-0.5">
                            {gp.circuit} • {gp.country}
                          </p>
                        </div>

                        {/* Circuit SVG line art */}
                        <div className="hidden md:flex md:col-span-2 items-center justify-center text-white/30 group-hover:text-[#E8462E] transition-colors">
                          <CircuitSvg name={`${gp.circuit} ${gp.country}`} className="w-16 h-10" />
                        </div>

                        {/* Date & Action */}
                        <div className="md:col-span-3 flex flex-col md:items-end justify-center text-left md:text-right">
                          <span className="text-sm font-bold text-white uppercase tabular-nums">
                            {format(raceDate, "dd MMM yyyy")}
                          </span>
                          <span className="text-xs text-white/50 tabular-nums">
                            RACE: {format(raceDate, "HH:mm")} LOCAL
                          </span>
                          <span className="text-[10px] text-[#E8462E] font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            INSPECT 3D TELEMETRY →
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center font-mono text-xs text-white/40 uppercase tracking-widest">
                NO GRAND PRIX EVENTS FOUND MATCHING SEARCH.
              </div>
            )}
          </div>
        )}

      </div>

      {/* FLOATING 3D TRACK PREVIEW MODAL ON HOVER */}
      <AnimatePresence>
        {hoveredCircuit && activeGP && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 pointer-events-none hidden md:block shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            style={{
              left: mousePos.x + 28,
              top: mousePos.y - 120,
            }}
          >
            <div className="w-[320px] h-[360px] bg-[#171715] border border-white/20 overflow-hidden flex flex-col relative">
              <div className="p-4 z-10 bg-[#0D0D0C]/80 border-b border-white/10 font-mono">
                <div className="text-[10px] text-[#E8462E] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#E8462E]" />
                  3D CIRCUIT TELEMETRY
                </div>
                <h4 className="text-white font-display uppercase tracking-wide text-lg leading-tight truncate">
                  {activeGP.name}
                </h4>
                <div className="flex justify-between text-[10px] text-white/50 uppercase mt-1 tabular-nums">
                  <span>{activeGP.laps || 52} LAPS</span>
                  <span>{activeGP.length || "5.000"} KM</span>
                  <span>{activeGP.distance || "306.3"} KM</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <TrackMap key={activeGP.circuit} circuitName={activeGP.circuit} />
              </div>

              <div className="px-4 py-2 bg-[#0D0D0C] border-t border-white/10 font-mono text-[9px] text-white/40 uppercase flex justify-between">
                <span>INTERACTIVE 3D MAPPING</span>
                <span className="text-[#E8462E]">CLICK TO OPEN HUB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
