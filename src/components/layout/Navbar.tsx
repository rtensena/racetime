"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "01", name: "Schedule", href: "/#schedule", hash: "#schedule" },
  { id: "02", name: "Standings", href: "/#standings", hash: "#standings" },
  { id: "03", name: "Drivers", href: "/#drivers", hash: "#drivers" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (hash: string) => {
    setActiveHash(hash);
    setOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#0D0D0C]/85 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo - RaceTime Hub */}
          <Link
            href="/"
            onClick={() => handleNavClick("")}
            className="flex items-center gap-2 group"
          >
            <span className="font-display font-black text-xl sm:text-2xl tracking-wider uppercase text-white group-hover:text-[#E8462E] transition-colors">
              RACE<span className="text-[#E8462E]">TIME</span>
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[#E8462E]/60 text-[#E8462E] font-bold tracking-widest uppercase bg-[#E8462E]/10 rounded-sm">
              HUB
            </span>
          </Link>

          {/* Desktop Navigation - Seamless & Minimal */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = activeHash === item.hash;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.hash)}
                  className={cn(
                    "uppercase tracking-widest transition-colors relative py-1",
                    isActive ? "text-[#E8462E] font-bold" : "text-white/70 hover:text-white"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8462E]"
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Seamless Live Timing Pill + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#schedule"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/20 hover:border-[#E8462E] bg-white/5 hover:bg-white/10 font-mono text-[11px] uppercase tracking-wider text-white transition-all rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
              <span>LIVE TIMING</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden p-2 text-white/80 hover:text-white"
            >
              <span className="font-mono text-sm uppercase">
                {open ? "CLOSE [×]" : "MENU [≡]"}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Seamless Mobile Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0D0D0C]/95 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="space-y-6 text-left">
              <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase block border-b border-white/10 pb-2">
                RACETIME HUB // NAVIGATION
              </span>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => handleNavClick(item.hash)}
                      className="text-4xl font-display font-black uppercase tracking-tight text-white hover:text-[#E8462E] transition-colors block"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/10">
                <a
                  href="#schedule"
                  onClick={() => setOpen(false)}
                  className="w-full inline-block bg-[#E8462E] text-white py-3 text-center font-mono text-xs font-bold uppercase tracking-widest"
                >
                  OPEN LIVE TIMING →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
