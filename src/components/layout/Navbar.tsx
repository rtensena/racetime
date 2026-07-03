"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", hash: "" },
  { name: "Schedule", href: "/#schedule", hash: "#schedule" },
  { name: "Standings", href: "/#standings", hash: "#standings" },
  { name: "Driver", href: "/#driver", hash: "#driver" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavClick = (hash: string) => {
    setActiveHash(hash);
    setOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-transparent flex items-center justify-between px-6 h-20 transition-all duration-300 pointer-events-none">
        {/* LOGO */}
        <Link href="/" onClick={() => handleNavClick("")} className="flex items-center gap-2 group pointer-events-auto">
          <h1 className="font-display text-2xl italic tracking-widest uppercase text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            RACETIME
          </h1>
        </Link>

        {/* BURGER - Neon outline style */}
        <button 
          onClick={() => setOpen(true)} 
          className="w-12 h-12 bg-black/50 backdrop-blur-sm border border-race-accent flex flex-col items-center justify-center gap-[5px] hover:bg-race-accent group transition-all duration-300 z-50 rounded-full pointer-events-auto shadow-[0_0_15px_rgba(212,255,0,0.2)]"
        >
          <span className="block w-5 h-[2px] bg-race-accent group-hover:bg-black transition-colors rounded-full"></span>
          <span className="block w-6 h-[2px] bg-race-accent group-hover:bg-black transition-colors rounded-full"></span>
          <span className="block w-4 h-[2px] bg-race-accent group-hover:bg-black transition-colors rounded-full"></span>
        </button>
      </nav>

      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            {/* BACKDROP */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* SIDEBAR / FULLSCREEN OVERLAY */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[400px] h-full bg-[#0a0a0a] border-l border-white/10 p-6 md:p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
            >
              {/* TOP HEADER (Mobile Only Logo + Close) */}
              <div className="flex justify-between items-center mb-12">
                <div className="md:hidden">
                  <h1 className="font-display text-xl italic tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    RACETIME
                  </h1>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group hover:border-race-accent hover:bg-race-accent/10 transition-colors ml-auto"
                >
                  <div className="relative w-5 h-5">
                    <span className="absolute top-1/2 left-0 w-5 h-[2px] bg-white rotate-45 group-hover:bg-race-accent transition-colors"></span>
                    <span className="absolute top-1/2 left-0 w-5 h-[2px] bg-white -rotate-45 group-hover:bg-race-accent transition-colors"></span>
                  </div>
                </button>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 flex flex-col gap-12">
                {/* PAGES SECTION */}
                <div>
                  <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Pages</span>
                  <ul className="space-y-4">
                    {navItems.map((item) => {
                      const isActive = item.hash 
                        ? activeHash === item.hash
                        : pathname === "/" && activeHash === "";

                      return (
                        <li key={item.name} className="overflow-hidden">
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
                          >
                            <a 
                              href={item.href}
                              onClick={() => handleNavClick(item.hash)}
                              className={cn(
                                "inline-block text-4xl font-display uppercase tracking-widest transition-all duration-300 hover:translate-x-4",
                                isActive ? "text-race-accent drop-shadow-[0_0_15px_rgba(212,255,0,0.5)]" : "text-white hover:text-race-accent"
                              )}
                            >
                              {item.name}
                            </a>
                          </motion.div>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* FOLLOW SECTION */}
                <div>
                  <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Follow</span>
                  <ul className="space-y-3">
                    {["Instagram", "X / Twitter", "YouTube", "TikTok"].map((link, idx) => (
                      <li key={link} className="overflow-hidden">
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + (idx * 0.05), type: "spring", stiffness: 300, damping: 24 }}
                        >
                          <a 
                            href="#"
                            className="inline-flex items-center gap-2 text-2xl font-display uppercase tracking-widest text-white/70 hover:text-race-accent transition-colors duration-300 group"
                          >
                            {link}
                          </a>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* BOTTOM CTA & FOOTER */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-8">
                {/* LIVE TIMING CTA */}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full bg-race-accent text-black px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                >
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  Live Timing
                </motion.button>

                {/* FOOTER LINKS */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-4 items-center"
                >
                  <div className="flex items-center gap-4 opacity-70">
                    <a href="#" className="text-white/50 hover:text-white font-sans text-[10px] font-medium uppercase tracking-widest transition-colors">Privacy Policy</a>
                    <span className="text-white/30 text-[10px]">•</span>
                    <a href="#" className="text-white/50 hover:text-white font-sans text-[10px] font-medium uppercase tracking-widest transition-colors">Terms of Use</a>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">R</span>
                    </div>
                    <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/30">
                      © {new Date().getFullYear()} RaceTime
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
