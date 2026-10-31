"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FooterHelmetLazy = dynamic(
  () => import("@/components/ui/FooterHelmet").then((mod) => mod.FooterHelmet),
  { ssr: false }
);

export function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useGSAP(() => {
    if (!innerRef.current || !containerRef.current) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Lando Norris-style curtain reveal (Parallax)
    gsap.fromTo(
      innerRef.current,
      { yPercent: -35 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <footer ref={containerRef} className="relative w-full overflow-hidden bg-[#0D0D0C] pt-28 pb-8 font-sans">
      <div ref={innerRef} className="relative w-full h-full">
        
        {/* Background Ambient Glow & Subtle Contour Track Lines */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1600px] h-[700px] bg-[#E8462E]/15 blur-[180px] rounded-[100%] pointer-events-none z-0" />

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
          viewport={{ once: true, amount: 0 }}
          className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center"
        >
          {/* Headline Before Notch — Desktop */}
          <div className="hidden md:block text-center mb-[-40px] relative z-20">
            <motion.p
              variants={itemVariants}
              className="font-mono text-sm md:text-base text-[#E8462E] uppercase tracking-widest mb-2"
            >
              RaceTime Heritage
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-[clamp(2.5rem,7.5vw,6rem)] font-display font-black uppercase tracking-tight leading-[0.9] text-white"
            >
              <span>ALWAYS BRINGING</span>
              <br />
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

          {/* Floating Card Wrapper with Notch Top */}
          <motion.div variants={itemVariants} className="relative w-full max-w-6xl mt-16">
            <div
              className="relative w-full bg-[#131311] border border-white/10 rounded-3xl px-4 md:px-10 pb-12 md:pb-8 pt-24 md:pt-32 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden"
              style={{
                clipPath:
                  "polygon(0 0, calc(50% - 140px) 0, calc(50% - 100px) 50px, calc(50% + 100px) 50px, calc(50% + 140px) 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              {/* Running Marquee Text behind model */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none hidden md:block opacity-10">
                <div
                  className="inline-block text-[110px] font-display font-black uppercase tracking-tight text-white"
                  style={{ animation: "marquee-scroll 50s linear infinite" }}
                >
                  LIGHTS OUT & AWAY WE GO • FOLLOW EVERY RACE WEEKEND WITH RACETIME • PRACTICE • QUALIFYING • SPRINT • RACE • NEVER MISS THE ACTION •
                </div>
              </div>

              {/* Two Column Navigation (Desktop) */}
              <div className="relative z-20 hidden md:flex justify-between items-end w-full min-h-[300px]">
                {/* Left Column: Pages */}
                <div className="flex flex-col gap-6">
                  <span className="text-white/40 font-mono text-xs font-bold tracking-[0.3em] uppercase">
                    PAGES
                  </span>
                  <ul className="flex flex-col gap-3 font-display">
                    {["Home", "Schedule", "Standings", "Drivers"].map((link) => (
                      <motion.li key={link} variants={itemVariants}>
                        <Link
                          href={link === "Home" ? "/" : `/#${link.toLowerCase()}`}
                          className="text-[clamp(2rem,5.5vw,3rem)] font-bold uppercase tracking-wider text-white hover:text-[#E8462E] transition-colors block"
                        >
                          {link}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Right Column: Follow */}
                <div className="flex flex-col gap-6 text-right items-end">
                  <span className="text-white/40 font-mono text-xs font-bold tracking-[0.3em] uppercase">
                    FOLLOW
                  </span>
                  <ul className="flex flex-col gap-3 items-end font-display">
                    {["Instagram", "X / Twitter", "YouTube", "TikTok"].map((link) => (
                      <motion.li key={link} variants={itemVariants}>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-[clamp(1.5rem,3.8vw,2.25rem)] font-bold uppercase tracking-wider text-white hover:text-[#E8462E] transition-colors"
                        >
                          {link}
                          <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 opacity-40 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Desktop 3D Helmet Model popping out of notch */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[400px] h-[500px] z-10 pointer-events-none hidden md:flex justify-center items-end scale-110 origin-bottom -translate-y-5">
                <FooterHelmetLazy />
              </div>

              {/* Divider (Desktop Only) */}
              <div className="w-full h-px bg-white/10 mt-16 mb-8 relative z-20 hidden md:block" />

              {/* Desktop Bottom Bar */}
              <div className="relative z-20 hidden md:flex justify-between items-center w-full font-mono text-xs text-white/50">
                <span>© {currentYear} RaceTime. All rights reserved.</span>

                {/* Center CTA Button */}
                <a
                  href="#schedule"
                  className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#E8462E] hover:bg-[#FF5438] text-white px-7 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(232,70,46,0.5)] z-40"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE TIMING
                </a>

                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="relative z-30 flex md:hidden flex-col items-center w-full mt-6">
                
                {/* Mobile Links */}
                <div className="flex justify-between w-full max-w-xs font-mono text-xs">
                  <div>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest block mb-2">PAGES</span>
                    <ul className="space-y-2 uppercase font-bold">
                      <li><a href="/" className="text-white hover:text-[#E8462E]">Home</a></li>
                      <li><a href="#schedule" className="text-white hover:text-[#E8462E]">Schedule</a></li>
                      <li><a href="#standings" className="text-white hover:text-[#E8462E]">Standings</a></li>
                      <li><a href="#drivers" className="text-white hover:text-[#E8462E]">Drivers</a></li>
                    </ul>
                  </div>

                  <div className="text-right">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest block mb-2">FOLLOW</span>
                    <ul className="space-y-2 uppercase font-bold">
                      <li><a href="#" className="text-white hover:text-[#E8462E]">Instagram</a></li>
                      <li><a href="#" className="text-white hover:text-[#E8462E]">X / Twitter</a></li>
                      <li><a href="#" className="text-white hover:text-[#E8462E]">YouTube</a></li>
                      <li><a href="#" className="text-white hover:text-[#E8462E]">TikTok</a></li>
                    </ul>
                  </div>
                </div>

                {/* Mobile Tagline */}
                <div className="flex flex-col items-center mt-10 text-center">
                  <span className="font-mono text-xs text-[#E8462E] uppercase tracking-widest mb-1">
                    Never
                  </span>
                  <h3 className="font-display font-black text-4xl uppercase tracking-tight text-white leading-none">
                    BACK DOWN
                  </h3>
                </div>

                {/* Mobile 3D Helmet */}
                <div className="relative w-[220px] aspect-square flex justify-center items-center my-6 pointer-events-auto">
                  <FooterHelmetLazy />
                </div>

                {/* Mobile CTA */}
                <a
                  href="#schedule"
                  className="bg-[#E8462E] hover:bg-[#FF5438] text-white px-8 h-[44px] rounded-full font-mono font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-lg z-40 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE TIMING
                </a>

                {/* Mobile Footer Bottom */}
                <div className="flex items-center justify-center gap-3 w-full pb-4 font-mono text-[10px] text-white/40">
                  <a href="#" className="hover:text-white">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-white">Terms of Use</a>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
