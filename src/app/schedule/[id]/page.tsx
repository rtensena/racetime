"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { format } from "date-fns";
import { ArrowLeft, Clock, MapPin, Flag, Compass } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { TrackMap } from "@/components/ui/TrackMap";

export default function GrandPrixDetail() {
  const params = useParams();
  const router = useRouter();
  const gpId = params.id as string;

  const { data: gp, isLoading, isError } = useQuery({
    queryKey: ["event", gpId],
    queryFn: () => api.getEventDetails(gpId),
  });

  return (
    <div className="min-h-screen bg-[#0D0D0C] text-[#E8E6E1] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Top Header / Back Bar */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO CALENDAR</span>
        </button>

        {gp && (
          <div className="font-mono text-xs text-[#E8462E] border border-[#E8462E]/30 bg-[#E8462E]/10 px-3 py-1 font-bold uppercase">
            {gp.status}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="w-1/3 h-12 bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <Skeleton className="w-full h-64 bg-white/5" />
              <Skeleton className="w-full h-48 bg-white/5" />
            </div>
            <div className="lg:col-span-6">
              <Skeleton className="w-full h-[500px] bg-white/5" />
            </div>
          </div>
        </div>
      )}

      {/* Error View */}
      {isError && (
        <div className="max-w-2xl mx-auto py-24 text-center font-mono border border-[#E8462E] bg-[#171715] p-8">
          <h2 className="text-xl font-bold uppercase text-[#E8462E] mb-2">Grand Prix Data Unavailable</h2>
          <p className="text-sm text-white/60 mb-6">Unable to load event telemetry for ID: {gpId}</p>
          <button
            onClick={() => router.push("/#schedule")}
            className="border border-[#E8462E] text-[#E8462E] hover:bg-[#E8462E] hover:text-white px-5 py-2.5 text-xs font-bold uppercase transition-colors"
          >
            RETURN TO RACE CALENDAR
          </button>
        </div>
      )}

      {/* Main Detail View */}
      {gp && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Info, Schedule & Track Specs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-8">
              
              {/* Event Header */}
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-[#E8462E] uppercase tracking-wider mb-2">
                  <Flag className="w-3.5 h-3.5" />
                  <span>2026 WORLD CHAMPIONSHIP ROUND</span>
                  {gp.isSprintWeekend && (
                    <span className="border border-[#E8462E] px-1.5 py-0.2 text-[10px] ml-2">
                      SPRINT WEEKEND
                    </span>
                  )}
                </div>

                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
                  {gp.name}
                </h1>

                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-white/60 mt-3">
                  <MapPin className="w-4 h-4 text-[#E8462E] shrink-0" />
                  <span className="text-white font-bold">{gp.circuit}</span>
                  <span>•</span>
                  <span>{gp.country}</span>
                </div>
              </div>

              {/* Official Weekend Schedule */}
              <div className="border border-white/10 bg-[#171715] p-5 sm:p-6 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E8462E]" />
                    OFFICIAL WEEKEND TIMETABLE
                  </span>
                  <span className="text-[10px] text-white/40 uppercase">LOCAL SYSTEM TIME</span>
                </div>

                <div className="space-y-2.5">
                  {gp.sessions && gp.sessions.map((sess) => {
                    const isRace = sess.name === "Race";
                    const sessDate = new Date(sess.date);

                    return (
                      <div
                        key={sess.id}
                        className={cn(
                          "p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors",
                          isRace
                            ? "border-[#E8462E] bg-[#E8462E]/10"
                            : "border-white/10 bg-[#0D0D0C]/80"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "font-display font-bold text-lg uppercase tracking-wide",
                              isRace ? "text-[#E8462E]" : "text-white"
                            )}
                          >
                            {sess.name}
                          </span>
                          {sess.status === "Live" && (
                            <span className="text-[9px] bg-[#22C55E] text-black font-bold uppercase px-1.5 py-0.5 animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs tabular-nums text-white/70">
                          <span>{format(sessDate, "EEEE, dd MMM")}</span>
                          <span
                            className={cn(
                              "font-bold text-base",
                              isRace ? "text-[#E8462E]" : "text-white"
                            )}
                          >
                            {format(sessDate, "HH:mm")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Circuit Telemetry Specifications Grid */}
              <div className="border border-white/10 bg-[#171715] p-5 sm:p-6 font-mono">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-white/10 pb-3 mb-4">
                  CIRCUIT SPECIFICATIONS
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="border border-white/10 bg-[#0D0D0C] p-3">
                    <span className="block text-[10px] text-white/40 uppercase mb-1">TRACK LENGTH</span>
                    <span className="font-display font-bold text-2xl text-white">
                      {gp.length || "5.412"}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">KM</span>
                  </div>

                  <div className="border border-white/10 bg-[#0D0D0C] p-3">
                    <span className="block text-[10px] text-white/40 uppercase mb-1">RACE LAPS</span>
                    <span className="font-display font-bold text-2xl text-[#E8462E]">
                      {gp.laps || 57}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">LAPS</span>
                  </div>

                  <div className="border border-white/10 bg-[#0D0D0C] p-3">
                    <span className="block text-[10px] text-white/40 uppercase mb-1">RACE DISTANCE</span>
                    <span className="font-display font-bold text-2xl text-white">
                      {gp.distance || "308.2"}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">KM</span>
                  </div>

                  <div className="border border-white/10 bg-[#0D0D0C] p-3">
                    <span className="block text-[10px] text-white/40 uppercase mb-1">FIRST COMPETED</span>
                    <span className="font-display font-bold text-2xl text-white">
                      {gp.firstCompeted || 1950}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">INAUGURAL</span>
                  </div>
                </div>
              </div>

              {/* Circuit Description */}
              {gp.description && (
                <div className="border border-white/10 bg-[#171715] p-5 sm:p-6 font-mono text-xs text-white/70 leading-relaxed">
                  <span className="text-white font-bold uppercase block mb-2">CIRCUIT PROFILE:</span>
                  <p>{gp.description}</p>
                </div>
              )}

            </div>

            {/* Right Column: 3D Interactive Circuit Model (5 cols) */}
            <div className="lg:col-span-5 sticky top-8">
              <div className="border border-white/10 bg-[#171715] p-4 sm:p-6 flex flex-col">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-xs">
                  <span className="font-bold text-white uppercase flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#E8462E]" />
                    3D CIRCUIT ELEVATION MAP
                  </span>
                  <span className="text-[10px] text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* 3D Track Canvas */}
                <div className="w-full h-[400px] sm:h-[500px] lg:h-[550px] bg-[#0D0D0C] border border-white/10 relative overflow-hidden group">
                  <div className="absolute bottom-3 left-3 z-10 font-mono text-[9px] text-white/50 bg-black/70 px-2.5 py-1 border border-white/10 uppercase">
                    DRAG TO ROTATE • SCROLL TO ZOOM
                  </div>
                  <TrackMap circuitName={gp.circuit} />
                </div>

                <div className="mt-3 flex justify-between font-mono text-[10px] text-white/40 uppercase">
                  <span>CIRCUIT CODE: {gp.id.toUpperCase()}</span>
                  <span>FIA GRADE 1 CERTIFIED</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
