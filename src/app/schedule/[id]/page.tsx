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

          {/* Mobile: Top 3D Track, Desktop: Right 3D Track (65-70%) */}
          <div className="w-full lg:w-[65%] h-[400px] lg:h-full relative bg-white/[0.02] rounded-3xl border border-white/5 order-1 lg:order-2 overflow-hidden group">
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

          {/* Mobile: Bottom Info, Desktop: Left Info (30-35%) */}
          <div className="w-full lg:w-[35%] shrink-0 h-full overflow-y-auto pr-2 order-2 lg:order-1 flex flex-col pt-4 lg:pt-0 custom-scrollbar">
             
            <h1 className="text-5xl lg:text-[60px] font-display uppercase tracking-widest text-white leading-tight break-words" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
              {gp.name}
            </h1>
            <p className="text-xs font-bold text-race-accent uppercase tracking-widest mb-8 mt-4 max-w-[300px] lg:max-w-full text-ellipsis overflow-hidden whitespace-nowrap" title={`${gp.country} AT ${gp.circuit}`}>
              {gp.country} AT {gp.circuit}
            </p>
             
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 mb-10 border-y border-white/10 py-8">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">When</p>
                <p className="text-3xl lg:text-4xl font-display text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {format(new Date(gp.date), "dd-MM")}
                </p>
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest mt-1">{format(new Date(gp.date), "MMM yyyy")}</p>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Length</p>
                <p className="text-3xl lg:text-4xl font-display text-white">
                  {gp.length || "5.891"} <span className="text-sm text-white/40">KM</span>
                </p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 mb-1">First Competed</p>
                <p className="text-xl font-display text-race-accent">{gp.firstCompeted || "1950"}</p>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Distance</p>
                <p className="text-3xl lg:text-4xl font-display text-white">
                  {gp.distance || "306.332"} <span className="text-sm text-white/40">KM</span>
                </p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 mb-1">Laps</p>
                <p className="text-xl font-display text-race-accent">{gp.laps || "52"}</p>
              </motion.div>
            </div>

            {/* Description */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-10">
              <p className="text-sm text-white/80 leading-relaxed font-sans">
                {gp.description || "One of the most iconic races on the calendar, featuring high speeds and intense corners."}
              </p>
            </motion.div>
            
            {/* Schedule */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto pb-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Weekend Schedule</p>
              <div className="flex flex-col gap-3">
                {gp.sessions.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-sm font-display uppercase tracking-wider p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
                    <span className={cn(s.name === "Race" ? "text-race-accent drop-shadow-[0_0_5px_rgba(225,6,0,0.8)]" : "text-white")}>
                      {s.name}
                    </span>
                    <div className="flex gap-4 items-center">
                      <span className="text-white/50 text-xs">{format(new Date(s.date), "dd MMM")}</span>
                      <span className="text-white font-bold w-12 text-right">{format(new Date(s.date), "HH:mm")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
