"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalPreloader() {
  const [stage, setStage] = useState<number>(0); // 0 to 5 for lights on
  const [lightsOut, setLightsOut] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("racetime_preloader_viewed", "true");
    }
  }, []);

  useEffect(() => {
    // Check if user already viewed preloader or prefers reduced motion
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("racetime_preloader_viewed")) {
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sessionStorage.setItem("racetime_preloader_viewed", "true");
        return;
      }
    }

    setIsVisible(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Authentic F1 Start Sequence Timing:
    // 1 red light every 350ms, then a random hold when all 5 are lit (1.0s - 1.4s), then LIGHTS OUT!
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 650);
    const t3 = setTimeout(() => setStage(3), 1000);
    const t4 = setTimeout(() => setStage(4), 1350);
    const t5 = setTimeout(() => setStage(5), 1700);

    // Random hold duration between 800ms and 1300ms
    const randomHold = 800 + Math.random() * 500;
    const tOut = setTimeout(() => {
      setLightsOut(true);
      setIsRevealed(true);
      setTimeout(() => {
        dismiss();
      }, 400);
    }, 1700 + randomHold);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tOut);
    };
  }, [dismiss]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="f1-start-gantry"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[9999] bg-[#090908] flex flex-col items-center justify-center p-4 select-none font-mono"
        onClick={dismiss}
      >
        <div className="w-full max-w-lg border border-white/10 bg-[#121210] p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
          {/* Top Race Control Label */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-8 text-[10px] text-white/50 uppercase tracking-widest">
            <span className="flex items-center gap-2 text-[#E8462E] font-bold">
              <span className="w-2 h-2 bg-[#E8462E] animate-ping" />
              FIA RACE CONTROL // START PROCEDURE
            </span>
            <span>2026 WORLD CHAMPIONSHIP</span>
          </div>

          {/* Authentic F1 Start Lights Gantry Bar */}
          <div className="w-full bg-[#090908] border-2 border-white/15 p-6 mb-8 shadow-inner">
            <div className="grid grid-cols-5 gap-3 sm:gap-5 max-w-sm mx-auto">
              {[1, 2, 3, 4, 5].map((lightIdx) => {
                const isLit = !lightsOut && stage >= lightIdx;
                return (
                  <div key={lightIdx} className="flex flex-col items-center gap-2">
                    {/* Upper Black Housing */}
                    <div className="w-11 sm:w-14 h-14 sm:h-16 bg-[#171715] border border-white/10 rounded-sm flex items-center justify-center p-1.5 shadow-md relative">
                      {/* Red Light Bezel */}
                      <div
                        className={`w-full h-full rounded-full transition-all duration-75 flex items-center justify-center ${
                          isLit
                            ? "bg-[#E8462E] shadow-[0_0_25px_#E8462E,0_0_50px_rgba(232,70,46,0.8)]"
                            : "bg-[#251513] border border-white/5"
                        }`}
                      >
                        {isLit && (
                          <div className="w-4 h-4 bg-white rounded-full opacity-80 blur-[1px]" />
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] text-white/30 font-bold">
                      {lightIdx}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Text with Race Engineer Voice */}
          <div className="text-center space-y-2 mb-6">
            <p className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
              {lightsOut
                ? "LIGHTS OUT & AWAY WE GO!"
                : stage === 5
                ? "ALL 5 RED LIGHTS ON... HOLDING REVS..."
                : `GRID FORMING... LIGHT ${stage} / 5`}
            </p>
            <p className="text-xs text-white/50 tracking-wider">
              {lightsOut
                ? "LAUNCH TELEMETRY ENGAGED"
                : "WARMING UP TIRES & GEARBOX"}
            </p>
          </div>

          {/* Skip Button */}
          <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
            <span>START GRID SEQUENCE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              className="text-white/60 hover:text-[#E8462E] underline underline-offset-4 uppercase transition-colors"
            >
              [SKIP TO START / ESC]
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
