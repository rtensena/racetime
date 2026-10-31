"use client";

import { DriverStanding, ConstructorStanding } from "@/lib/types";

interface StandingsPreviewProps {
  driver?: DriverStanding;
  constructor?: ConstructorStanding;
}

export function StandingsPreview({ driver, constructor: team }: StandingsPreviewProps) {
  if (driver) {
    return (
      <div className="flex items-center justify-between border-b border-[#3A3A35] py-2 px-3 font-mono text-xs hover:bg-[#232320]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#E8462E]">{driver.position}</span>
          <span className="font-bold text-[#E8E6E1]">{driver.lastName.toUpperCase()}</span>
          <span className="text-[#78766F] text-[10px] uppercase">({driver.team})</span>
        </div>
        <span className="font-bold tabular-nums text-[#E8E6E1]">{driver.points} PTS</span>
      </div>
    );
  }

  if (team) {
    return (
      <div className="flex items-center justify-between border-b border-[#3A3A35] py-2 px-3 font-mono text-xs hover:bg-[#232320]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#E8462E]">{team.position}</span>
          <span className="font-bold text-[#E8E6E1]">{team.name.toUpperCase()}</span>
        </div>
        <span className="font-bold tabular-nums text-[#E8E6E1]">{team.points} PTS</span>
      </div>
    );
  }

  return null;
}
