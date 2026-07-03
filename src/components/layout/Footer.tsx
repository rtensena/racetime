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

  useGSAP(() => {
    if (!innerRef.current || !containerRef.current) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Lando Norris-style curtain reveal (Parallax)
    gsap.fromTo(innerRef.current,
      { yPercent: -40 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <footer ref={containerRef} className="relative w-full overflow-hidden bg-black pt-32 pb-8">
      <div ref={innerRef} className="relative w-full h-full">
        {/* BACKGROUND GLOW & PATTERN */}
      {/* Massive radial green glow at the bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1800px] h-[900px] bg-race-accent/25 blur-[200px] rounded-[100%] pointer-events-none z-0" />

      {/* Subtle Contour/Topography Pattern with gentle motion */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 90 Q 25 65 50 90 T 100 90' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center"
      >

        {/* HEADLINE BEFORE NOTCH — DESKTOP ONLY.
            Mobile has its own tagline further down inside the card,
            so this must not render on small screens or it duplicates. */}
        <div className="hidden md:block text-center mb-[-40px] relative z-20">
          <motion.p variants={itemVariants} className="font-signature text-xl md:text-3xl text-white/40 -rotate-6 mb-2 ml-[-100px] md:ml-[-150px]">
            RaceTime
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-[clamp(2.5rem,8vw,6.25rem)] font-display uppercase tracking-tighter leading-[0.9] md:leading-none">
            <span className="text-white">ALWAYS BRINGING</span><br />
            <motion.span
              className="text-race-accent inline-block"
              animate={{ textShadow: ["0 0 0px rgba(212,255,0,0)", "0 0 20px rgba(212,255,0,0.6)", "0 0 0px rgba(212,255,0,0)"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              THE FIGHT
            </motion.span>
          </motion.h2>
        </div>

        {/* FLOATING CARD WRAPPER WITH ANIMATION */}
        <motion.div
          variants={itemVariants}
          className="relative w-full max-w-6xl mt-16"
        >
          {/* INNER CLIPPED BACKGROUND */}
          <div
            className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-3xl px-4 md:px-8 pb-12 md:pb-8 pt-24 md:pt-32 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
            style={{
              // CSS Clip-path to create the top notch
              clipPath: "polygon(0 0, calc(50% - 140px) 0, calc(50% - 100px) 50px, calc(50% + 100px) 50px, calc(50% + 140px) 0, 100% 0, 100% 100%, 0 100%)"
            }}
          >
          {/* RUNNING TEXT (MARQUEE) BEHIND MODEL */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none hidden md:block opacity-15">
            <motion.div
              className="inline-block text-[120px] font-display font-bold uppercase tracking-tighter text-white"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            >
              Lights Out & Away We Go • Follow Every Race Weekend with RaceTime • Practice • Qualifying • Sprint • Race • Never Miss the Action • Lights Out & Away We Go • Follow Every Race Weekend with RaceTime • Practice • Qualifying • Sprint • Race • Never Miss the Action •
            </motion.div>
          </div>

          {/* TWO COLUMN NAVIGATION (LEFT & RIGHT) — DESKTOP ONLY.
              Mobile renders its own compact PAGES / FOLLOW ON columns
              further down, so this must be hidden below md or both
              versions render at once (this was the "duplicate FOLLOW" bug). */}
          <div className="relative z-20 hidden md:flex md:flex-row justify-between items-end w-full h-full min-h-[300px] gap-0">

            {/* LEFT COLUMN - PAGES */}
            <div className="flex flex-col gap-6">
              <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Pages</span>
              <ul className="flex flex-col gap-3">
                {["Home", "Schedule", "Standings", "Drivers"].map((link) => (
                  <motion.li key={link} variants={itemVariants}>
                    <Link
                      href={link === "Home" ? "/" : `/#${link.toLowerCase()}`}
                      className="text-[clamp(2rem,6vw,3rem)] font-display uppercase tracking-widest text-white hover:text-race-accent transition-colors duration-300 block"
                    >
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* RIGHT COLUMN - FOLLOW */}
            <div className="flex flex-col gap-6 md:text-right">
              <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Follow</span>
              <ul className="flex flex-col gap-3 items-start md:items-end">
                {["Instagram", "X / Twitter", "YouTube", "TikTok"].map((link) => (
                  <motion.li key={link} variants={itemVariants}>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-[clamp(1.5rem,4vw,2.25rem)] font-display uppercase tracking-widest text-white hover:text-race-accent transition-colors duration-300"
                    >
                      {link}
                      <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

          </div>

          {/* DIVIDER (Desktop Only) */}
          <div className="w-full h-[1px] bg-white/10 mt-16 mb-8 relative z-20 hidden md:block" />

          {/* DESKTOP BOTTOM BAR */}
          <div className="relative z-20 hidden md:flex flex-row justify-between items-center w-full">
            <span className="text-white/40 font-sans text-xs font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} RaceTime
            </span>

            {/* CENTER CTA */}
            <button className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-race-accent text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)] z-40">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Live Timing
            </button>

            <div className="flex flex-row items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white font-sans text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white font-sans text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap">
                Terms of Use
              </a>
            </div>
          </div>

          {/* MOBILE REDESIGN: NEW FOOTER OVERLAY (Below Nav Links) */}
          <div className="relative z-30 flex md:hidden flex-col items-center w-full mt-10">

            {/* 2. KOLOM PAGES & FOLLOW ON */}
            <div className="flex flex-row justify-center gap-12 w-[80%] max-w-[350px]">
              {/* PAGES COLUMN */}
              <div className="flex flex-col items-start flex-1">
                <span className="text-[10px] text-white/50 tracking-[0.2em] mb-2 uppercase">Pages</span>
                <ul className="flex flex-col gap-2">
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">Home</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">Schedule</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">Standings</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">Drivers</a></li>
                </ul>
              </div>

              {/* FOLLOW ON COLUMN */}
              <div className="flex flex-col items-start flex-1">
                <span className="text-[10px] text-white/50 tracking-[0.2em] mb-2 uppercase">Follow On</span>
                <ul className="flex flex-col gap-2">
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">Instagram</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">X / Twitter</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">YouTube</a></li>
                  <li><a href="#" className="text-white hover:text-race-accent text-[14px]">TikTok</a></li>
                </ul>
              </div>
            </div>


            {/* 4. TAGLINE BESAR
                Fixed: was using negative absolute offsets (-top-5 -left-4) with
                no reserved space, which made "Never" overlap directly on top of
                "BACK". Switched to normal flow + small negative margin so the
                script text sits just above the headline instead of on it. */}
            <div className="flex flex-col items-center mt-10">
              <span className="font-signature text-[22px] leading-none text-race-accent -rotate-6 -mb-1 drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]">
                Never
              </span>
              <h3 className="font-display text-[34px] leading-[0.95] uppercase tracking-tighter text-white font-bold text-center">
                BACK<br />DOWN
              </h3>
            </div>

            {/* 5. FOTO HELM
                Fixed: was double-scaled (fixed 300x400px box scaled 0.45,
                nested inside a 50%/160px container) — two conflicting sizing
                systems that shrank the model way down. Single sizing system now. */}
            <div className="relative w-[58%] max-w-[220px] aspect-square flex justify-center items-center my-6 mx-auto pointer-events-auto">
              <FooterHelmetLazy />
            </div>

            {/* 6. TOMBOL CTA */}
            <button className="w-auto bg-race-accent text-black px-8 h-[42px] rounded-full font-display font-bold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(212,255,0,0.3)] z-40 mb-8">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              LIVE TIMING
            </button>

            {/* 7. FOOTER TEXT PALING BAWAH */}
            <div className="flex flex-row items-center justify-center gap-3 w-full pb-6 opacity-40">
              <a href="#" className="text-white font-sans text-[10px] font-medium uppercase tracking-widest whitespace-nowrap hover:opacity-100 transition-opacity">Privacy Policy</a>
              <span className="text-white/50 text-[10px]">•</span>
              <a href="#" className="text-white font-sans text-[10px] font-medium uppercase tracking-widest whitespace-nowrap hover:opacity-100 transition-opacity">Terms of Use</a>
            </div>
          </div>

          </div>

          {/* DESKTOP 3D HELMET MODEL */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[400px] h-[500px] z-10 pointer-events-none hidden md:flex justify-center items-end scale-110 origin-bottom -translate-y-5">
            <FooterHelmetLazy />
          </div>

        </motion.div>
      </motion.div>
      </div>
    </footer>
  );
}