"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import dynamic from "next/dynamic";

const FooterHelmetLazy = dynamic(
  () => import("@/components/ui/FooterHelmet").then((mod) => mod.FooterHelmet),
  { ssr: false }
);

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-black pt-32 pb-8">
      {/* BACKGROUND GLOW & PATTERN */}
      {/* Massive radial green glow at the bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-race-accent/20 blur-[150px] rounded-[100%] pointer-events-none z-0" />
      
      {/* Subtle Contour/Topography Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 90 Q 25 65 50 90 T 100 90' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
        
        {/* HEADLINE BEFORE NOTCH */}
        <div className="text-center mb-[-40px] relative z-20">
          <p className="font-signature text-2xl md:text-3xl text-white/40 -rotate-6 mb-2 ml-[-150px]">
            RaceTime
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-[100px] font-display uppercase tracking-tighter leading-none">
            <span className="text-white">ALWAYS BRINGING</span><br />
            <span className="text-race-accent">THE FIGHT</span>
          </h2>
        </div>

        {/* FLOATING CARD */}
        <div 
          className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-3xl mt-16 px-8 pb-8 pt-32 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          style={{
            // CSS Clip-path to create the top notch
            clipPath: "polygon(0 0, calc(50% - 180px) 0, calc(50% - 140px) 80px, calc(50% + 140px) 80px, calc(50% + 180px) 0, 100% 0, 100% 100%, 0 100%)"
          }}
        >
          {/* RUNNING TEXT (MARQUEE) BEHIND MODEL */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none opacity-15">
            <motion.div 
              className="inline-block text-[120px] font-display font-bold uppercase tracking-tighter text-white"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              Lights Out & Away We Go • Follow Every Race Weekend with RaceTime • Practice • Qualifying • Sprint • Race • Never Miss the Action 
            </motion.div>
          </div>

          {/* 3D HELMET MODEL */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[400px] h-[500px] z-10 pointer-events-none flex justify-center items-end" style={{ transform: "scale(1.1) translateY(-20px)" }}>
            <FooterHelmetLazy />
          </div>

          {/* TWO COLUMN NAVIGATION (LEFT & RIGHT) */}
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end w-full h-full min-h-[300px] mt-12 md:mt-0 gap-12 md:gap-0">
            
            {/* LEFT COLUMN - PAGES */}
            <div className="flex flex-col gap-6">
              <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Pages</span>
              <ul className="flex flex-col gap-3">
                {["Home", "Schedule", "Standings", "Drivers"].map((link) => (
                  <li key={link}>
                    <Link 
                      href={link === "Home" ? "/" : `/#${link.toLowerCase()}`}
                      className="text-3xl md:text-5xl font-display uppercase tracking-widest text-white hover:text-race-accent transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT COLUMN - FOLLOW */}
            <div className="flex flex-col gap-6 md:text-right">
              <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Follow</span>
              <ul className="flex flex-col gap-3 items-start md:items-end">
                {["Instagram", "X / Twitter", "YouTube", "TikTok"].map((link) => (
                  <li key={link}>
                    <a 
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-2xl md:text-4xl font-display uppercase tracking-widest text-white hover:text-race-accent transition-colors duration-300"
                    >
                      {link}
                      <ArrowUpRight className="w-6 h-6 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

          {/* DIVIDER */}
          <div className="w-full h-[1px] bg-white/10 mt-16 mb-8 relative z-20" />

          {/* BOTTOM BAR */}
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-white/40 font-sans text-xs font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} RaceTime
            </span>

            {/* CENTER CTA */}
            <button className="absolute left-1/2 -translate-x-1/2 -top-14 md:top-1/2 md:-translate-y-1/2 bg-race-accent text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Live Timing
            </button>

            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white font-sans text-xs font-medium uppercase tracking-widest transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white font-sans text-xs font-medium uppercase tracking-widest transition-colors">
                Terms of Use
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
