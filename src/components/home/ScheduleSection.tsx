"use client";

import { useState, useRef, useEffect } from "react";
import { useSchedule } from "@/hooks/useF1Data";
import { Search, AlertTriangle, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { TrackMap } from "@/components/ui/TrackMap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScheduleSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [hoveredCircuit, setHoveredCircuit] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { data: schedule, isLoading, isError, refetch, dataUpdatedAt } = useSchedule("2026");

  // Force ScrollTrigger and Lenis to refresh when DOM height changes (after data load)
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 100);
    }
  }, [isLoading, schedule]);

  const filteredGPs = schedule?.filter((gp) =>
    gp.name.toLowerCase().includes(search.toLowerCase()) ||
    gp.country.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Emoji flag mapper helper
  const getFlagEmoji = (country: string) => {
    const flags: Record<string, string> = {
      "Bahrain": "🇧🇭", "Saudi Arabia": "🇸🇦", "Australia": "🇦🇺", "Japan": "🇯🇵",
      "China": "🇨🇳", "Miami": "🇺🇸", "Emilia Romagna": "🇮🇹", "Monaco": "🇲🇨",
      "Canada": "🇨🇦", "Spain": "🇪🇸", "Austria": "🇦🇹", "Great Britain": "🇬🇧",
      "Hungary": "🇭🇺", "Belgium": "🇧🇪", "Netherlands": "🇳🇱", "Italy": "🇮🇹",
      "Azerbaijan": "🇦🇿", "Singapore": "🇸🇬", "United States": "🇺🇸", "Mexico": "🇲🇽",
      "Brazil": "🇧🇷", "Las Vegas": "🇺🇸", "Qatar": "🇶🇦", "Abu Dhabi": "🇦🇪",
      "Argentina": "🇦🇷", "South Africa": "🇿🇦", "Germany": "🇩🇪", "France": "🇫🇷",
      "Portugal": "🇵🇹", "Turkey": "🇹🇷", "Malaysia": "🇲🇾", "India": "🇮🇳", "Korea": "🇰🇷"
    };
    return flags[country] || "🏁";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const activeGP = filteredGPs.find(gp => gp.circuit === hoveredCircuit);

  return (
    <section 
      id="schedule" 
      ref={containerRef} 
      className="container mx-auto px-4 md:px-8 py-24 max-w-[1200px] min-h-screen relative"
      onMouseMove={handleMouseMove}
    >
      <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-widest mb-2 leading-none">
            Race <span className="text-race-accent">Calendar</span>
          </h2>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-white/60 font-sans text-sm uppercase tracking-wider font-medium">
              The definitive 2026 World Championship schedule.
            </p>
            {dataUpdatedAt > 0 && (
              <p className="text-[10px] text-race-accent font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-race-accent animate-pulse" />
                Live: Last synced {new Date(dataUpdatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </motion.div>
        
        {/* Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-race-gray/40 backdrop-blur-md border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-race-accent transition-colors"
          />
        </div>
      </div>

      {/* States: Loading, Error */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-xl opacity-20" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-race-gray/20 rounded-2xl border border-race-accent/20">
          <AlertTriangle className="w-12 h-12 text-race-accent mb-4" />
          <h3 className="text-2xl font-display uppercase tracking-widest text-white mb-2">Failed to load schedule</h3>
          <button onClick={() => refetch()} className="flex items-center gap-2 px-6 py-3 bg-race-accent text-black font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors mt-6">
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* Data Layout: 3 Columns Full Width */}
      {!isLoading && !isError && (
        <div className="w-full flex flex-col mt-4">
          
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/40 px-6">
            <div className="col-span-2 md:col-span-1">Round</div>
            <div className="col-span-6 md:col-span-7">Location</div>
            <div className="col-span-4 text-right md:text-left">When</div>
          </div>

          <div className="flex flex-col" onMouseLeave={() => setHoveredCircuit(null)}>
            <AnimatePresence>
              {filteredGPs.map((gp, i) => {
                const isFinished = gp.status === "Finished";
                const isOngoing = gp.status === "Ongoing";
                const isUpcoming = gp.status === "Upcoming";
                const roundNum = String(i + 1).padStart(2, '0');
                
                // The "Next Race" is the first one that is Ongoing or Upcoming
                const isNextRace = (isOngoing || isUpcoming) && !filteredGPs.slice(0, i).some(r => r.status === "Ongoing" || r.status === "Upcoming");
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    key={gp.id}
                    className={cn(
                      "block group border-b border-white/5 transition-colors duration-300 relative overflow-hidden",
                      isNextRace ? "bg-race-gray-2" : "hover:bg-white/[0.03]"
                    )}
                    onMouseEnter={() => setHoveredCircuit(gp.circuit)}
                    onClick={() => setHoveredCircuit(gp.circuit)}
                  >
                    <Link href={`/schedule/${gp.id}`} className="grid grid-cols-12 gap-4 items-center py-5 px-6 cursor-pointer relative z-10">
                      
                      {/* 1. ROUND */}
                      <div className="col-span-2 md:col-span-1 flex items-center relative w-fit">
                        <span className={cn(
                          "text-2xl md:text-4xl font-display font-bold transition-colors",
                          isFinished ? "text-white/20" : isNextRace ? "text-race-accent" : "text-white/50",
                        )}>
                          {roundNum}
                        </span>
                        {isFinished && (
                          <span className="absolute inset-0 w-[120%] h-[2px] bg-race-accent top-1/2 -translate-y-1/2 -rotate-12 -left-[10%]" />
                        )}
                      </div>

                      {/* 2. LOCATION */}
                      <div className="col-span-6 md:col-span-7 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-3">
                          <h3 className={cn(
                            "text-xl md:text-3xl font-display uppercase tracking-widest leading-none truncate transition-colors",
                            isFinished ? "text-white/20" : isNextRace ? "text-race-accent drop-shadow-[0_0_10px_rgba(212,255,0,0.3)]" : "text-white",
                          )}>
                            {gp.country}
                          </h3>
                          <span className="text-xl md:text-2xl leading-none grayscale group-hover:grayscale-0 transition-all">{getFlagEmoji(gp.country)}</span>
                        </div>
                        
                        {gp.isSprintWeekend && (
                          <span className="inline-block w-fit text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-race-accent/20 text-race-accent border border-race-accent/20">
                            Sprint
                          </span>
                        )}
                      </div>

                      {/* 3. WHEN */}
                      <div className="col-span-4 flex flex-col justify-center text-right md:text-left">
                        <span className={cn(
                          "text-sm md:text-xl font-display uppercase tracking-widest transition-colors",
                          isFinished ? "text-white/20" : isNextRace ? "text-race-accent" : "text-white/80"
                        )}>
                          {format(new Date(gp.date), "dd MMM yyyy")}
                        </span>
                        {isNextRace && (
                          <span className="text-[10px] text-race-accent font-bold uppercase tracking-widest animate-pulse mt-1">
                            Up Next
                          </span>
                        )}
                      </div>

                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isLoading && !isError && filteredGPs.length === 0 && (
        <div className="text-center py-20 text-white/40 font-bold uppercase tracking-widest">
          No Grand Prix found matching your search.
        </div>
      )}

      {/* FLOATING TRACK PREVIEW MODAL */}
      <AnimatePresence>
        {hoveredCircuit && activeGP && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 pointer-events-none md:pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            style={{
              // Center on mobile, follow cursor on desktop
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : mousePos.x + 30,
              top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : mousePos.y + 30,
              transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'translate(-50%, -50%)' : 'none'
            }}
          >
            <div className="w-[300px] h-[350px] bg-gradient-to-b from-race-gray-2 to-[#1a2600] border border-race-accent rounded-2xl overflow-hidden flex flex-col relative group">
              {/* Close button for mobile tap */}
              <button 
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 rounded-full md:hidden flex items-center justify-center text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setHoveredCircuit(null);
                }}
              >
                ×
              </button>
              
              <div className="p-4 z-10 bg-black/40 backdrop-blur-sm border-b border-white/10">
                <h4 className="text-race-accent font-display uppercase tracking-widest text-lg leading-none mb-1">
                  {activeGP.name}
                </h4>
                <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  <span>{activeGP.laps || 52} Laps</span>
                  <span>{activeGP.distance || 306.3} KM</span>
                </div>
              </div>
              
              <div className="flex-1 relative cursor-grab active:cursor-grabbing pointer-events-auto">
                {/* 3D Track */}
                <TrackMap key={activeGP.circuit} circuitName={activeGP.circuit} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
