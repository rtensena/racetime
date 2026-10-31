"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSchedule } from "@/hooks/useF1Data";
import { mockGrandPrix } from "@/lib/mockData";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GrandPrix } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HeroCountdown() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const { data: schedule } = useSchedule("current");

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute next race dynamically from calendar data
  const { nextRace, isSeasonComplete, roundNumber, totalRounds } = useMemo(() => {
    const list: GrandPrix[] = schedule && schedule.length > 0 ? schedule : mockGrandPrix;
    const currentTime = now ? now.getTime() : Date.now();

    const upcomingList = list.filter((gp) => {
      const raceDate = new Date(gp.date).getTime();
      return raceDate > currentTime;
    });

    if (upcomingList.length === 0) {
      return {
        nextRace: list[list.length - 1],
        isSeasonComplete: true,
        roundNumber: list.length,
        totalRounds: list.length,
      };
    }

    const next = upcomingList[0];
    const index = list.findIndex((gp) => gp.id === next.id);

    return {
      nextRace: next,
      isSeasonComplete: false,
      roundNumber: index !== -1 ? index + 1 : 1,
      totalRounds: list.length,
    };
  }, [schedule, now]);

  // Tabular Countdown
  const timeLeft = useMemo(() => {
    if (!nextRace || !now) {
      return { d: "00", h: "00", m: "00", s: "00" };
    }
    const target = new Date(nextRace.date).getTime();
    const diff = Math.max(0, Math.floor((target - now.getTime()) / 1000));

    const d = String(Math.floor(diff / 86400)).padStart(2, "0");
    const h = String(Math.floor((diff % 86400) / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");

    return { d, h, m, s };
  }, [nextRace, now]);

  const timeUnits = [
    { label: "Days", value: timeLeft.d },
    { label: "Hours", value: timeLeft.h },
    { label: "Minutes", value: timeLeft.m },
    { label: "Seconds", value: timeLeft.s },
  ];

  const cinematicEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

  // GSAP Parallax
  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Parallax text
    gsap.to(textRef.current, {
      y: 100,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Parallax grid
    gsap.to(gridRef.current, {
      y: 50,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-transparent text-[#E8E6E1] pt-24 sm:pt-28 pb-12"
    >
      {/* Top Ticker Strip */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-white/60 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[#E8462E] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#E8462E] animate-pulse" />
              LIVE TELEMETRY
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/80">
              {isSeasonComplete ? "SEASON COMPLETED" : `ROUND ${roundNumber} OF ${totalRounds}`}
            </span>
          </div>

          <div className="tabular-nums text-white/80">
            {now ? format(now, "HH:mm:ss") + " LOCAL" : "LIVE"}
          </div>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center text-center my-auto py-4">
        
        {/* Title Block */}
        <div ref={textRef} className="w-full flex flex-col items-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: cinematicEase }}
            className="flex flex-col items-center w-full"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 border border-[#E8462E]/60 bg-[#E8462E]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#E8462E] mb-6 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#E8462E]" />
              PREPARE FOR LIGHTS OUT
              {nextRace?.isSprintWeekend && (
                <span className="ml-2 border-l border-[#E8462E]/40 pl-2 text-white">
                  SPRINT
                </span>
              )}
            </div>

            {/* Giant Grand Prix Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[105px] font-display font-black uppercase tracking-tight leading-[0.88] text-white drop-shadow-2xl mb-4">
              {nextRace ? (
                <>
                  <span>{nextRace.name.replace("Grand Prix", "").trim()}</span>
                  <br />
                  <span className="text-[#E8462E]">GRAND PRIX</span>
                </>
              ) : (
                "WORLD CHAMPIONSHIP"
              )}
            </h1>

            {/* Circuit & Date */}
            {nextRace && (
              <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/70 mt-2 mb-10 flex flex-wrap items-center justify-center gap-2">
                <span className="text-white font-bold">{nextRace.circuit}</span>
                <span className="text-[#E8462E]">•</span>
                <span>{nextRace.country}</span>
                <span className="text-[#E8462E]">•</span>
                <span className="text-white/90">{format(new Date(nextRace.date), "dd MMMM yyyy")}</span>
              </p>
            )}
          </motion.div>
        </div>

        {/* Dynamic Countdown Grid with Kinetic 3D Cards */}
        <div ref={gridRef} className="w-full flex justify-center max-w-4xl">
          {isClient ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
              }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full perspective-[1000px]"
            >
              {timeUnits.map((unit) => (
                <motion.div
                  key={unit.label}
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: { duration: 0.7, ease: cinematicEase },
                    },
                  }}
                  className="flex flex-col items-center bg-[#121210]/90 backdrop-blur-md border border-white/10 p-5 sm:p-7 hover:border-[#E8462E]/60 transition-colors shadow-2xl relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 group-hover:bg-[#E8462E] transition-colors" />

                  <div className="relative overflow-hidden h-16 sm:h-24 flex items-center justify-center w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={unit.value}
                        initial={{ y: 35, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -35, opacity: 0 }}
                        transition={{ duration: 0.35, ease: cinematicEase }}
                        className="text-5xl sm:text-7xl font-display font-black tracking-tight text-white group-hover:text-[#E8462E] transition-colors tabular-nums absolute"
                      >
                        {unit.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 mt-3 group-hover:text-white/80 transition-colors">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-32 sm:h-44 w-full" />
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 font-mono text-xs"
        >
          <a
            href="#schedule"
            className="bg-[#E8462E] hover:bg-[#FF5438] text-white px-6 py-3 font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
          >
            <span>RACE CALENDAR</span>
            <span>↓</span>
          </a>
          <a
            href="#standings"
            className="border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-white px-6 py-3 font-bold uppercase tracking-wider transition-colors backdrop-blur-sm"
          >
            WORLD STANDINGS →
          </a>
        </motion.div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center font-mono text-[10px] text-white/40 uppercase tracking-widest">
        <span>SCROLL TO EXPLORE TELEMETRY</span>
        <span className="text-[#E8462E] text-xs mt-1 animate-bounce">↓</span>
      </div>
    </section>
  );
}
