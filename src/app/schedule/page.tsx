"use client";

import { useState } from "react";
import { useSchedule } from "@/hooks/useF1Data";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, AlertTriangle, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SchedulePage() {
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("2026");
  
  const { data: schedule, isLoading, isError, refetch } = useSchedule(season);

  const filteredGPs = schedule?.filter((gp) =>
    gp.name.toLowerCase().includes(search.toLowerCase()) ||
    gp.country.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 max-w-7xl min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-display uppercase tracking-widest mb-4">
          Race <span className="text-race-accent">Calendar</span>
        </h1>
        <p className="text-white/60 font-sans text-lg uppercase tracking-wider font-medium max-w-2xl">
          Complete schedule for the selected Formula 1 season.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search Grand Prix..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-race-gray border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/40 focus:outline-none focus:border-race-accent transition-colors"
          />
        </div>
        
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="bg-race-gray border border-white/10 rounded-full py-4 px-6 text-white focus:outline-none focus:border-race-accent transition-colors appearance-none cursor-pointer"
        >
          <option value="2026">2026 Season</option>
          <option value="2025">2025 Season</option>
          <option value="2024">2024 Season</option>
        </select>
      </div>

      {/* States: Loading, Error, Data */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-race-gray/40 border border-white/5 rounded-2xl p-6 h-64">
              <Skeleton className="w-24 h-6 mb-8 rounded-full" />
              <Skeleton className="w-48 h-8 mb-2" />
              <Skeleton className="w-32 h-4 mb-8" />
              <Skeleton className="w-full h-px mb-6 opacity-20" />
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-32 h-6" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-race-gray/20 rounded-2xl border border-race-accent/20">
          <AlertTriangle className="w-12 h-12 text-race-accent mb-4" />
          <h3 className="text-2xl font-display uppercase tracking-widest text-white mb-2">Failed to load schedule</h3>
          <p className="text-white/60 mb-6">There was an error communicating with the F1 API.</p>
          <button onClick={() => refetch()} className="flex items-center gap-2 px-6 py-3 bg-race-accent text-white font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-colors">
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGPs.map((gp) => {
              const isUpcoming = gp.status === "Upcoming";
              const isFinished = gp.status === "Finished";
              const isOngoing = gp.status === "Ongoing";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={gp.id}
                >
                  <Link
                    href={`/schedule/${gp.id}`}
                    className={cn(
                      "block bg-race-gray/40 border border-white/5 rounded-2xl p-6 hover:bg-race-gray transition-all group overflow-hidden relative h-full",
                      isFinished && "opacity-60 hover:opacity-100",
                      isOngoing && "border-race-accent/50 shadow-[0_0_20px_rgba(225,6,0,0.1)]"
                    )}
                  >
                    {isOngoing && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-race-accent animate-pulse" />
                    )}
                    
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block",
                          isUpcoming && "bg-white/10 text-white",
                          isFinished && "bg-white/5 text-white/40",
                          isOngoing && "bg-race-accent/20 text-race-accent"
                        )}>
                          {gp.status}
                          {isOngoing && <span className="inline-block w-1.5 h-1.5 bg-race-accent rounded-full ml-2 animate-ping" />}
                        </span>
                        {gp.isSprintWeekend && (
                          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block bg-race-accent text-white ml-2">
                            Sprint
                          </span>
                        )}
                      </div>
                      <Calendar className="w-5 h-5 text-white/20 group-hover:text-race-accent transition-colors" />
                    </div>

                    <h3 className="text-2xl font-display uppercase tracking-wider mb-1">
                      {gp.country}
                    </h3>
                    <p className="text-sm font-sans font-bold text-race-accent uppercase tracking-widest mb-6">
                      {gp.name}
                    </p>

                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                        Weekend
                      </p>
                      <p className="text-lg font-sans font-medium text-white">
                        {format(new Date(gp.date), "dd MMM")} - {format(new Date(gp.sessions[gp.sessions.length - 1].date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && !isError && filteredGPs.length === 0 && (
        <div className="text-center py-20 text-white/40 font-bold uppercase tracking-widest">
          No Grand Prix found matching your search.
        </div>
      )}
    </div>
  );
}
