"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function StandingsPage() {
  const [tab, setTab] = useState<"drivers" | "constructors">("drivers");
  const [season, setSeason] = useState("2026");

  const { data: drivers, isLoading: isLoadingDrivers, isError: isErrorDrivers } = useQuery({
    queryKey: ["standings", "drivers", season],
    queryFn: () => api.getDriverStandings(season)
  });
  
  const { data: constructors, isLoading: isLoadingConstructors, isError: isErrorConstructors } = useQuery({
    queryKey: ["standings", "constructors", season],
    queryFn: () => api.getConstructorStandings(season)
  });

  const isLoading = tab === "drivers" ? isLoadingDrivers : isLoadingConstructors;
  const isError = tab === "drivers" ? isErrorDrivers : isErrorConstructors;

  // Sharp, fast transitions inspired by speed
  const sharpTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 max-w-5xl min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl md:text-7xl font-display uppercase tracking-widest mb-4">
            World <span className="text-race-accent">Championship</span>
          </h1>
          <p className="text-white/60 font-sans text-lg uppercase tracking-wider font-medium max-w-2xl">
            Selected season standings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-race-gray border border-white/10 rounded-full py-3 px-6 text-white focus:outline-none focus:border-race-accent transition-colors appearance-none cursor-pointer text-sm font-bold uppercase tracking-widest"
          >
            <option value="2026">2026 Season</option>
            <option value="2025">2025 Season</option>
            <option value="2024">2024 Season</option>
          </select>

          {/* Tabs */}
          <div className="flex bg-race-gray p-1 rounded-full border border-white/10 w-fit relative overflow-hidden">
            <button
              onClick={() => setTab("drivers")}
              className={cn(
                "relative z-10 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors duration-300",
                tab === "drivers" ? "text-black" : "text-white/60 hover:text-white"
              )}
            >
              Drivers
            </button>
            <button
              onClick={() => setTab("constructors")}
              className={cn(
                "relative z-10 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors duration-300",
                tab === "constructors" ? "text-black" : "text-white/60 hover:text-white"
              )}
            >
              Constructors
            </button>
            
            {/* Sliding Pill Background for Tabs */}
            <motion.div 
              layout
              className="absolute top-1 bottom-1 w-[114px] bg-race-accent rounded-full z-0"
              initial={false}
              animate={{
                x: tab === "drivers" ? 4 : 118,
                width: tab === "drivers" ? 104 : 144
              }}
              transition={sharpTransition}
            />
          </div>
        </div>
      </motion.div>

      <div className="relative min-h-[500px]">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full h-24 rounded-xl border border-white/5" />
            ))}
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-race-accent font-bold uppercase tracking-widest bg-race-gray/30 rounded-xl border border-white/10">
            Failed to load standings.
          </div>
        )}

        {!isLoading && !isError && (
          <AnimatePresence mode="wait" custom={tab}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === "drivers" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === "drivers" ? 20 : -20 }}
              transition={sharpTransition}
              className="flex flex-col gap-4"
            >
              <AnimatePresence>
                {tab === "drivers" && drivers && drivers.map((driver, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      layout: { type: "spring", stiffness: 200, damping: 20 },
                      delay: index * 0.05
                    }}
                    key={driver.driverId}
                    className="flex items-center bg-race-gray/40 border border-white/5 rounded-xl p-4 md:p-6 hover:shadow-[0_0_30px_rgba(212,255,0,0.2)] hover:border-race-accent/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-12 text-center text-4xl font-display text-white/20 group-hover:text-race-accent group-hover:scale-110 transition-all duration-300 transform-gpu">
                      {driver.position}
                    </div>

                    <div className="flex-1 ml-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-white/80 transition-colors">
                        {driver.firstName}
                      </p>
                      <p className="text-2xl md:text-3xl font-display uppercase tracking-wider text-white group-hover:text-race-accent transition-colors">
                        {driver.lastName}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-widest text-white/40 mt-1">
                        {driver.team}
                      </p>
                    </div>

                    <div className="text-right flex items-baseline gap-2">
                      <p className="text-4xl md:text-5xl font-display text-white group-hover:scale-105 origin-right transition-transform">
                        {driver.points} 
                      </p>
                      <span className="text-sm text-white/40 uppercase tracking-widest font-bold">PTS</span>
                    </div>
                  </motion.div>
                ))}

                {tab === "constructors" && constructors && constructors.map((constructor, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      layout: { type: "spring", stiffness: 200, damping: 20 },
                      delay: index * 0.05
                    }}
                    key={constructor.teamId}
                    className="flex items-center bg-race-gray/40 border border-white/5 rounded-xl p-4 md:p-6 hover:shadow-[0_0_30px_rgba(212,255,0,0.2)] hover:border-race-accent/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-12 text-center text-4xl font-display text-white/20 group-hover:text-race-accent group-hover:scale-110 transition-all duration-300 transform-gpu">
                      {constructor.position}
                    </div>

                    <div className="flex-1 ml-6">
                      <p className="text-2xl md:text-3xl font-display uppercase tracking-wider text-white group-hover:text-race-accent transition-colors">
                        {constructor.name}
                      </p>
                    </div>

                    <div className="text-right flex items-baseline gap-2">
                      <p className="text-4xl md:text-5xl font-display text-white group-hover:scale-105 origin-right transition-transform">
                        {constructor.points} 
                      </p>
                      <span className="text-sm text-white/40 uppercase tracking-widest font-bold">PTS</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
