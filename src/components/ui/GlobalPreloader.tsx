"use client";

import { useProgress } from "@react-three/drei";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlobalPreloader() {
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  // Bulletproof fallback: Always close after 3.5 seconds maximum on any device
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  // Also close if progress hits 100 before 3.5 seconds, but give it a small 500ms delay
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Animated Background Pulse */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] bg-race-accent/20 rounded-full blur-[100px]"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Looping RaceTime Text */}
            <div className="flex overflow-hidden relative">
              <motion.h1
                animate={{ y: [40, 0, 0, -40], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl md:text-7xl font-display uppercase tracking-[0.2em] text-white"
              >
                Race<span className="text-race-accent">Time</span>
              </motion.h1>
              
              {/* Ghost text for trailing effect */}
              <motion.h1
                animate={{ y: [40, 0, 0, -40], opacity: [0, 0.3, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="absolute text-5xl md:text-7xl font-display uppercase tracking-[0.2em] text-race-accent/50 blur-sm"
              >
                Race<span className="text-white">Time</span>
              </motion.h1>
            </div>

            {/* Progress Bar (Optional, subtle) */}
            <div className="mt-12 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-race-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(15, progress)}%` }} // Start at 15% to show some progress visually
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>
            
            <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {progress < 100 ? `Loading Assets... ${Math.round(progress)}%` : 'Starting Engine...'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
