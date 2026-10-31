"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { GrandPrix } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CircuitSvg } from "@/components/ui/CircuitSvg";

interface SchedulePreviewProps {
  gp: GrandPrix;
  roundNumber: number;
  isNextRace: boolean;
}

export function SchedulePreview({ gp, roundNumber, isNextRace }: SchedulePreviewProps) {
  const [showSessions, setShowSessions] = useState(false);
  const isFinished = gp.status === "Finished";
  const isOngoing = gp.status === "Ongoing";

  const formattedRound = String(roundNumber).padStart(2, "0");
  const raceDate = new Date(gp.date);

  return (
    <div
      className={cn(
        "border-b border-[#3A3A35] transition-colors font-mono",
        isNextRace ? "bg-[#232320] border-l-4 border-l-[#E8462E]" : "hover:bg-[#232320]/60",
        isFinished && "opacity-75"
      )}
    >
      {/* Primary Row Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Round & Status Flag (Cols 1-2) */}
        <div className="md:col-span-2 flex items-center gap-3">
          <span
            className={cn(
              "font-display font-black text-2xl sm:text-3xl tabular-nums leading-none tracking-tight",
              isNextRace ? "text-[#E8462E]" : isFinished ? "text-[#78766F]" : "text-[#E8E6E1]"
            )}
          >
            {formattedRound}
          </span>
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "text-[9px] px-1.5 py-0.5 border font-bold uppercase tracking-wider inline-block w-fit",
                isNextRace
                  ? "border-[#E8462E] bg-[#E8462E] text-white"
                  : isOngoing
                  ? "border-[#22C55E] text-[#22C55E]"
                  : isFinished
                  ? "border-[#3A3A35] text-[#78766F]"
                  : "border-[#3A3A35] text-[#E8E6E1]"
              )}
            >
              {isNextRace ? "NEXT UP" : gp.status}
            </span>
            {gp.isSprintWeekend && (
              <span className="text-[9px] text-[#E8462E] border border-[#E8462E]/40 px-1 font-bold uppercase w-fit">
                SPRINT
              </span>
            )}
          </div>
        </div>

        {/* Circuit Line Art (Col 3, desktop only) */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-[#78766F] hover:text-[#E8462E] transition-colors">
          <CircuitSvg name={`${gp.circuit} ${gp.country}`} className="w-14 h-10" />
        </div>

        {/* Location & Grand Prix Name (Cols 4-7) */}
        <div className="md:col-span-5 lg:col-span-4 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3
              className={cn(
                "font-display font-bold text-lg sm:text-xl uppercase tracking-wide truncate",
                isNextRace ? "text-[#E8462E]" : "text-[#E8E6E1]"
              )}
            >
              {gp.name.replace("Grand Prix", "").trim()} GP
            </h3>
            <span className="text-xs text-[#78766F] uppercase">({gp.country})</span>
          </div>
          <p className="text-xs text-[#78766F] truncate uppercase mt-0.5">
            {gp.circuit}
          </p>
        </div>

        {/* Date & Local Timing (Cols 8-10) */}
        <div className="md:col-span-3 lg:col-span-3 text-left md:text-right">
          <span className="text-xs sm:text-sm font-bold text-[#E8E6E1] block tabular-nums uppercase">
            {format(raceDate, "dd MMM yyyy")}
          </span>
          <span className="text-[11px] text-[#78766F] block tabular-nums">
            RACE: {format(raceDate, "HH:mm")} LOCAL TIME
          </span>
        </div>

        {/* Actions (Cols 11-12) */}
        <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-2">
          <button
            onClick={() => setShowSessions(!showSessions)}
            aria-expanded={showSessions}
            className="text-[11px] px-2.5 py-1.5 border border-[#3A3A35] hover:border-[#E8E6E1] text-[#78766F] hover:text-[#E8E6E1] uppercase tracking-wider transition-colors"
          >
            {showSessions ? "HIDE [−]" : "TIMETABLE [+]"}
          </button>
          <Link
            href={`/schedule/${gp.id}`}
            className="text-[11px] px-2.5 py-1.5 bg-[#232320] border border-[#3A3A35] hover:border-[#E8462E] text-[#E8E6E1] hover:text-[#E8462E] uppercase tracking-wider transition-colors"
          >
            DETAILS →
          </Link>
        </div>

      </div>

      {/* Expandable Session Timings in User's Local Time */}
      {showSessions && (
        <div className="bg-[#1A1A17] border-t border-[#3A3A35] p-4 sm:p-5">
          <div className="max-w-4xl mx-auto">
            <div className="text-[10px] text-[#78766F] uppercase tracking-widest mb-3 flex items-center justify-between border-b border-[#3A3A35] pb-1">
              <span>OFFICIAL WEEKEND SCHEDULE (USER LOCAL TIMEZONE)</span>
              <span>CIRCUIT LENGTH: {gp.length || "5.000"} KM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {gp.sessions && gp.sessions.map((sess) => {
                const sDate = new Date(sess.date);
                const isMain = sess.name === "Race";
                return (
                  <div
                    key={sess.id}
                    className={cn(
                      "p-2.5 border text-xs",
                      isMain
                        ? "border-[#E8462E] bg-[#E8462E]/10 text-[#E8462E]"
                        : "border-[#3A3A35] bg-[#232320] text-[#E8E6E1]"
                    )}
                  >
                    <span className="block text-[10px] text-[#78766F] uppercase">
                      {sess.name}
                    </span>
                    <span className="block font-bold text-sm tabular-nums mt-0.5">
                      {format(sDate, "HH:mm")}
                    </span>
                    <span className="block text-[10px] text-[#78766F] mt-0.5 uppercase">
                      {format(sDate, "EEE, dd MMM")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
