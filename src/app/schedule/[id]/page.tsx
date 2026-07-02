"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Clock, MapPin, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { TrackMap } from "@/components/ui/TrackMap";
import { useRef } from "react";

export default function GrandPrixDetail() {
  const params = useParams();
  const router = useRouter();
  const gpId = params.id as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: gp, isLoading, isError } = useQuery({
    queryKey: ["event", gpId],
    queryFn: () => api.getEventDetails(gpId),
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const borderOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 md:px-8" ref={containerRef}>
      <div className="container mx-auto max-w-[1600px] mb-8 pt-10">
        <button
          onClick={() => router.back()}
          className="relative z-50 group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white hover:text-race-accent transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Calendar
        </button>
      </div>

      {isLoading && (
        <div className="container mx-auto max-w-7xl pt-20">
          <Skeleton className="w-full h-[80vh] rounded-[40px] border border-race-accent/20" />
        </div>
      )}

      {isError && (
        <div className="py-20 text-center text-race-accent font-bold uppercase tracking-widest">
          Failed to load Grand Prix details.
        </div>
      )}

      {gp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-[1600px] mx-auto h-auto lg:h-[80vh] min-h-[800px] mt-12 rounded-[2rem] border-2 border-race-accent/40 p-4 md:p-8 shadow-[0_0_30px_rgba(225,6,0,0.15)] flex flex-col lg:flex-row gap-8 overflow-hidden"
        >
          {/* Glowing Border Animation */}
          <motion.div 
            className="absolute inset-0 rounded-[2rem] border-2 border-race-accent pointer-events-none"
            style={{ opacity: borderOpacity, filter: "drop-shadow(0 0 10px rgba(225,6,0,0.8))" }}
          />

          {/* Desktop: Right 3D Track (65-70%). Hidden on Mobile as requested */}
          <div className="hidden lg:block w-full lg:w-[60%] h-[400px] lg:h-full relative bg-white/[0.02] rounded-3xl border border-white/5 order-1 lg:order-2 overflow-hidden group">
            <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-race-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">Interactive 3D Map</span>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                Drag to rotate • Scroll to zoom
              </span>
            </div>

            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <TrackMap circuitName={gp.circuit} />
            </div>
          </div>

          {/* Mobile: Full Info, Desktop: Left Info (40%) */}
          <div className="w-full lg:w-[40%] shrink-0 h-full overflow-y-auto pr-2 order-2 lg:order-1 flex flex-col pt-4 lg:pt-0 custom-scrollbar">
             
            <div className="shrink-0 mb-8">
              <h1 className="text-5xl lg:text-[60px] font-display uppercase tracking-widest text-white leading-tight break-words" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                {gp.name}
              </h1>
              <p className="text-xs font-bold text-race-accent uppercase tracking-widest mt-4 max-w-[300px] lg:max-w-full text-ellipsis overflow-hidden whitespace-nowrap" title={`${gp.country} AT ${gp.circuit}`}>
                {gp.country} AT {gp.circuit}
              </p>
            </div>
            
            {/* Schedule - Prominent & Second Position */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="shrink-0 mb-12 w-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Weekend Schedule
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {(() => {
                  const firstUpcoming = gp.sessions.find(s => s.status === "Upcoming" || s.status === "Live");
                  
                  return gp.sessions.map(s => {
                    const isNextUp = s.id === firstUpcoming?.id;
                    const isRace = s.name === "Race";
                    
                    return (
                      <div key={s.id} className={cn(
                        "flex flex-col md:flex-row justify-between items-start md:items-center font-display uppercase tracking-wider p-4 md:p-5 rounded-2xl border transition-colors shadow-lg relative overflow-hidden group gap-2 md:gap-0",
                        isRace ? "bg-[#1a2600] border-race-accent/40 hover:bg-[#253600]" : 
                        isNextUp ? "bg-white/[0.08] border-white/30 hover:bg-white/10" : 
                        "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                      )}>
                        
                        {isNextUp && !isRace && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-white/40" />
                        )}
                        {isRace && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-race-accent" />
                        )}

                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-xl md:text-2xl", 
                            isRace ? "text-race-accent drop-shadow-[0_0_10px_rgba(212,255,0,0.4)] font-bold md:text-3xl" : "text-white"
                          )}>
                            {s.name}
                          </span>
                          {isNextUp && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white ml-2 animate-pulse">
                              {s.status === "Live" ? "Live Now" : "Next Up"}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                          <span className="text-white/50 text-xs md:text-sm font-sans font-semibold tracking-wider">
                            {format(new Date(s.date), "EEE, dd MMM")}
                          </span>
                          <span className={cn(
                            "font-bold text-2xl md:text-3xl text-right", 
                            isRace ? "text-race-accent" : "text-white"
                          )}>
                            {format(new Date(s.date), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
             
            {/* Stats Grid - Moved down */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 mb-10 border-t border-white/10 pt-10 shrink-0">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">When</p>
                <p className="text-3xl lg:text-4xl font-display text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {format(new Date(gp.date), "dd-MM")}
                </p>
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest mt-1">{format(new Date(gp.date), "MMM yyyy")}</p>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Length</p>
                <p className="text-3xl lg:text-4xl font-display text-white">
                  {gp.length || "5.891"} <span className="text-sm text-white/40">KM</span>
                </p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 mb-1">First Competed</p>
                <p className="text-xl font-display text-race-accent">{gp.firstCompeted || "1950"}</p>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Distance</p>
                <p className="text-3xl lg:text-4xl font-display text-white">
                  {gp.distance || "306.332"} <span className="text-sm text-white/40">KM</span>
                </p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 mb-1">Laps</p>
                <p className="text-xl font-display text-race-accent">{gp.laps || "52"}</p>
              </motion.div>
            </div>

            {/* Description - Bottom */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8 hidden lg:block shrink-0 pt-6 border-t border-white/10">
              <p className="text-sm text-white/80 leading-relaxed font-sans">
                {gp.description || "One of the most iconic races on the calendar, featuring high speeds and intense corners."}
              </p>
            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
