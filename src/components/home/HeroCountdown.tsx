"use client";

import { useState, useEffect, useRef } from "react";
import { mockGrandPrix } from "@/lib/mockData";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export function HeroCountdown() {
  const nextGp = mockGrandPrix.find((gp) => gp.status === "Upcoming" || gp.status === "Ongoing") || mockGrandPrix[0];
  const [timeLeft, setTimeLeft] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(nextGp.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max((target - now) / 1000, 0);

      const d = String(Math.floor(diff / (3600 * 24))).padStart(2, "0");
      const h = String(Math.floor((diff % (3600 * 24)) / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(Math.floor(diff % 60)).padStart(2, "0");

      setTimeLeft({ d, h, m, s });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextGp]);

  const timeUnits = [
    { label: "Days", value: timeLeft.d },
    { label: "Hours", value: timeLeft.h },
    { label: "Minutes", value: timeLeft.m },
    { label: "Seconds", value: timeLeft.s },
  ];

  const cinematicEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

  // GSAP ScrollTrigger for Parallax Depth
  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Fast parallax for glow (moves down fast)
    gsap.to(glowRef.current, {
      y: 300,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Medium parallax + fade/scale for text
    gsap.to(textRef.current, {
      y: 150,
      scale: 0.9,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Slow parallax for the grid
    gsap.to(gridRef.current, {
      y: 50,
      opacity: 0,
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
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden w-full bg-background pt-20 pb-20">
      
      {/* Ambient Breathing Glow behind title with Parallax */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center pointer-events-none z-0">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-race-accent/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* GP Name & Badge */}
        <div ref={textRef} className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: cinematicEase }}
            className="mb-12 md:mb-16 flex flex-col items-center w-full"
          >
            {nextGp.isSprintWeekend && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mb-6 bg-race-accent text-black px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(212,255,0,0.4)]"
              >
                Sprint Weekend
              </motion.div>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-[140px] font-display uppercase tracking-widest leading-[0.9] drop-shadow-2xl">
              {nextGp.name.replace("Grand Prix", "").trim()}
              <br />
              <span className="text-race-accent">Grand Prix</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl font-bold uppercase tracking-widest text-white/60 font-sans">
              {nextGp.circuit} • {format(new Date(nextGp.date), "dd MMM yyyy")}
            </p>
          </motion.div>
        </div>

        {/* Staggered Countdown */}
        <div ref={gridRef} className="w-full flex justify-center">
          {isClient ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl perspective-[1200px]"
            >
              {timeUnits.map((unit) => (
                <motion.div
                  key={unit.label}
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -45 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: cinematicEase } }
                  }}
                  className="flex flex-col items-center bg-race-gray-2/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 hover:border-race-accent/40 hover:shadow-[0_20px_40px_rgba(212,255,0,0.1)] transition-all duration-300 transform-gpu origin-bottom group"
                >
                  <div className="relative overflow-hidden h-20 md:h-28 flex items-center justify-center w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={unit.value}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.4, ease: cinematicEase }}
                        className="text-6xl md:text-[90px] font-display tracking-tight text-white group-hover:text-race-accent transition-colors duration-300 absolute"
                      >
                        {unit.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/40 mt-4 md:mt-6 group-hover:text-white/80 transition-colors">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-40 md:h-56 w-full max-w-5xl" />
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-race-accent to-transparent opacity-30 z-10" />
    </section>
  );
}
