"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import dynamic from "next/dynamic";

const FooterHelmetLazy = dynamic(
  () => import("@/components/ui/FooterHelmet").then((mod) => mod.FooterHelmet),
  { ssr: false }
);

export function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <footer
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black flex flex-col justify-between py-5 sm:py-6 lg:py-8 font-sans border-t border-white/10"
    >
      {/* Background Ambient Glow & Subtle Contour Track Lines */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[550px] bg-[#E8462E]/10 blur-[160px] rounded-[100%] pointer-events-none z-0" />

      <motion.div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between h-full w-full max-w-7xl"
      >
        {/* 1. Header / Headline */}
        <div className="text-center relative z-20 shrink-0 mb-[-15px] sm:mb-[-25px] lg:mb-[-30px]">
          <motion.p
            variants={itemVariants}
            className="font-mono text-xs sm:text-sm text-[#E8462E] uppercase tracking-widest mb-1 font-bold"
          >
            RaceTime Heritage
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight leading-[0.95] text-white"
          >
            <span>ALWAYS BRINGING </span>
            <motion.span
              className="text-[#E8462E] inline-block"
              animate={{
                textShadow: [
                  "0 0 0px rgba(232,70,46,0)",
                  "0 0 25px rgba(232,70,46,0.6)",
                  "0 0 0px rgba(232,70,46,0)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              THE FIGHT
            </motion.span>
          </motion.h2>
        </div>

        {/* 2. Floating Card with Notch Top - fills the screen proportionally */}
        <motion.div
          variants={itemVariants}
          className="relative w-full flex-1 flex flex-col justify-between mt-6 sm:mt-8 max-h-[calc(100vh-140px)]"
        >
          <div
            className="relative w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl px-5 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-20 pb-5 sm:pb-6 shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(0 0, calc(50% - 130px) 0, calc(50% - 90px) 45px, calc(50% + 90px) 45px, calc(50% + 130px) 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            {/* Background running marquee */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none hidden md:block opacity-5">
              <div
                className="inline-block text-[90px] lg:text-[110px] font-display font-black uppercase tracking-tight text-white"
                style={{ animation: "marquee-scroll 50s linear infinite" }}
              >
                LIGHTS OUT & AWAY WE GO • FOLLOW EVERY RACE WEEKEND WITH RACETIME • PRACTICE • QUALIFYING • SPRINT • RACE • NEVER MISS THE ACTION •
              </div>
            </div>

            {/* Desktop Center Row: Links + 3D Helmet */}
            <div className="relative z-20 hidden md:grid grid-cols-12 items-center w-full flex-1 py-2">
              {/* Left Column: Pages */}
              <div className="col-span-3 flex flex-col gap-4">
                <span className="text-white/40 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                  PAGES
                </span>
                <ul className="flex flex-col gap-2 font-display">
                  {["Home", "Schedule", "Standings", "Drivers"].map((link) => (
                    <motion.li key={link} variants={itemVariants}>
                      <Link
                        href={link === "Home" ? "/" : `/#${link.toLowerCase()}`}
                        className="text-2xl lg:text-3xl font-bold uppercase tracking-wider text-white hover:text-[#E8462E] transition-colors block"
                      >
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Center Column: 3D Helmet Model */}
              <div className="col-span-6 relative h-[260px] lg:h-[340px] flex justify-center items-center pointer-events-none">
                <div className="w-[320px] lg:w-[420px] h-full flex justify-center items-center scale-100 lg:scale-105 pointer-events-auto">
                  <FooterHelmetLazy />
                </div>
              </div>

              {/* Right Column: Follow */}
              <div className="col-span-3 flex flex-col gap-4 text-right items-end">
                <span className="text-white/40 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                  FOLLOW
                </span>
                <ul className="flex flex-col gap-2 items-end font-display">
                  {["Instagram", "X / Twitter", "YouTube", "TikTok"].map((link) => (
                    <motion.li key={link} variants={itemVariants}>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 text-xl lg:text-2xl font-bold uppercase tracking-wider text-white hover:text-[#E8462E] transition-colors"
                      >
                        {link}
                        <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 opacity-40 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desktop Bottom Bar */}
            <div className="relative z-20 hidden md:flex flex-col w-full shrink-0">
              <div className="w-full h-px bg-white/10 mb-4" />
              <div className="flex justify-between items-center w-full font-mono text-xs text-white/50 relative">
                <span>© {currentYear} RaceTime. All rights reserved.</span>

                {/* Center CTA Button */}
                <a
                  href="#schedule"
                  className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#E8462E] hover:bg-[#FF5438] text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(232,70,46,0.4)]"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE TIMING
                </a>

                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                </div>
              </div>
            </div>

            {/* Mobile Layout (fills mobile screen nicely) */}
            <div className="relative z-30 flex md:hidden flex-col items-center justify-between w-full h-full py-2">
              {/* Mobile Links */}
              <div className="flex justify-between w-full px-2 font-mono text-xs">
                <div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest block mb-1.5">PAGES</span>
                  <ul className="space-y-1.5 uppercase font-bold text-xs">
                    <li><a href="/" className="text-white hover:text-[#E8462E]">Home</a></li>
                    <li><a href="#schedule" className="text-white hover:text-[#E8462E]">Schedule</a></li>
                    <li><a href="#standings" className="text-white hover:text-[#E8462E]">Standings</a></li>
                    <li><a href="#drivers" className="text-white hover:text-[#E8462E]">Drivers</a></li>
                  </ul>
                </div>

                <div className="text-right">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest block mb-1.5">FOLLOW</span>
                  <ul className="space-y-1.5 uppercase font-bold text-xs">
                    <li><a href="#" className="text-white hover:text-[#E8462E]">Instagram</a></li>
                    <li><a href="#" className="text-white hover:text-[#E8462E]">X / Twitter</a></li>
                    <li><a href="#" className="text-white hover:text-[#E8462E]">YouTube</a></li>
                    <li><a href="#" className="text-white hover:text-[#E8462E]">TikTok</a></li>
                  </ul>
                </div>
              </div>

              {/* Mobile 3D Helmet */}
              <div className="relative w-[190px] h-[190px] flex justify-center items-center pointer-events-auto my-2">
                <FooterHelmetLazy />
              </div>

              {/* Mobile Bottom Section */}
              <div className="w-full flex flex-col items-center gap-3">
                <a
                  href="#schedule"
                  className="bg-[#E8462E] hover:bg-[#FF5438] text-white px-7 h-[40px] rounded-full font-mono font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE TIMING
                </a>

                <div className="flex items-center justify-center gap-3 w-full font-mono text-[10px] text-white/40">
                  <span>© {currentYear} RaceTime</span>
                  <span>•</span>
                  <a href="#" className="hover:text-white">Privacy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-white">Terms</a>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
