"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function StandingsSection() {
  const [tab, setTab] = useState<"drivers" | "constructors">("drivers");
  const [season, setSeason] = useState("2026");
  
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: drivers, isLoading: isLoadingDrivers, isError: isErrorDrivers, dataUpdatedAt: driversUpdatedAt } = useQuery({
    queryKey: ["standings", "drivers", season],
    queryFn: () => api.getDriverStandings(season),
    refetchInterval: 60 * 1000
  });
  
  const { data: constructors, isLoading: isLoadingConstructors, isError: isErrorConstructors, dataUpdatedAt: constructorsUpdatedAt } = useQuery({
    queryKey: ["standings", "constructors", season],
    queryFn: () => api.getConstructorStandings(season),
    refetchInterval: 60 * 1000
  });

  const isLoading = tab === "drivers" ? isLoadingDrivers : isLoadingConstructors;
  const isError = tab === "drivers" ? isErrorDrivers : isErrorConstructors;
  const lastUpdated = tab === "drivers" ? driversUpdatedAt : constructorsUpdatedAt;

  const sharpTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  // Force ScrollTrigger and Lenis to refresh when DOM height changes (after data load)
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 100);
    }
  }, [isLoading, drivers, constructors]);

  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Removed pinning to allow natural page scroll

    // Scrub header opacity/y
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      }
    );

    // Scrub list elements from bottom
    gsap.fromTo(listRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "top 10%",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section id="standings" ref={containerRef} className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl flex flex-col justify-center">
      <div ref={headerRef} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 opacity-0">
        <div>
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-widest mb-3">
            World <span className="text-race-accent">Championship</span>
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-white/60 font-sans text-sm md:text-base uppercase tracking-wider font-medium max-w-2xl">
              Live Season Standings
            </p>
            {lastUpdated > 0 && (
              <p className="text-[10px] text-race-accent font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-race-accent animate-pulse" />
                Live: Last synced {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-race-gray/80 backdrop-blur-md border border-white/10 rounded-full py-2 px-4 text-white focus:outline-none focus:border-race-accent transition-colors appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest relative z-20"
          >
            <option value="2026">2026 Season</option>
            <option value="2025">2025 Season</option>
            <option value="2024">2024 Season</option>
          </select>

          {/* Tabs */}
          <div className="flex bg-race-gray/80 backdrop-blur-md p-1 rounded-full border border-white/10 w-fit relative z-20">
            {['drivers', 'constructors'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                  tab === t ? "text-black" : "text-white/60 hover:text-white"
                )}
              >
                {t === "drivers" ? "Drivers" : "Constructors"}
                {tab === t && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-race-accent rounded-full -z-10"
                    transition={sharpTransition}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={listRef} className="relative pr-4 opacity-0 pb-12">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl border border-white/5" />
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
              className="flex flex-col gap-2"
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
                    className="flex items-center bg-race-gray/40 border border-white/5 rounded-xl p-3 md:p-4 hover:shadow-[0_0_20px_rgba(212,255,0,0.15)] hover:border-race-accent/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 text-center text-2xl font-display text-white/20 group-hover:text-race-accent group-hover:scale-110 transition-all duration-300 transform-gpu">
                      {driver.position}
                    </div>

                    <div className="flex-1 ml-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white/80 transition-colors">
                        {driver.firstName}
                      </p>
                      <p className="text-lg md:text-xl font-display uppercase tracking-wider text-white group-hover:text-race-accent transition-colors">
                        {driver.lastName}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-white/40 mt-0.5">
                        {driver.team}
                      </p>
                    </div>

                    <div className="text-right flex items-baseline gap-2">
                      <p className="text-2xl md:text-3xl font-display text-white group-hover:scale-105 origin-right transition-transform">
                        {driver.points} 
                      </p>
                      <span className="text-xs text-white/40 uppercase tracking-widest font-bold">PTS</span>
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
                    className="flex items-center bg-race-gray/40 border border-white/5 rounded-xl p-3 md:p-4 hover:shadow-[0_0_20px_rgba(212,255,0,0.15)] hover:border-race-accent/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 text-center text-2xl font-display text-white/20 group-hover:text-race-accent group-hover:scale-110 transition-all duration-300 transform-gpu">
                      {constructor.position}
                    </div>

                    <div className="flex-1 ml-6">
                      <p className="text-lg md:text-xl font-display uppercase tracking-wider text-white group-hover:text-race-accent transition-colors">
                        {constructor.name}
                      </p>
                    </div>

                    <div className="text-right flex items-baseline gap-2">
                      <p className="text-2xl md:text-3xl font-display text-white group-hover:scale-105 origin-right transition-transform">
                        {constructor.points} 
                      </p>
                      <span className="text-xs text-white/40 uppercase tracking-widest font-bold">PTS</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
