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

        {/* BURGER - Small bright contrast box */}
        <button 
          onClick={() => setOpen(true)} 
          className="w-12 h-12 bg-white flex flex-col items-center justify-center gap-[4px] hover:bg-race-accent transition-colors duration-300 z-50 rounded pointer-events-auto shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
        >
          <span className="block w-6 h-[2px] bg-black"></span>
          <span className="block w-6 h-[2px] bg-black"></span>
          <span className="block w-6 h-[2px] bg-black"></span>
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

            {/* SIDEBAR */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[300px] md:w-[400px] h-full bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* CLOSE BUTTON */}
              <div className="flex justify-end mb-16">
                <button onClick={() => setOpen(false)} className="p-2 group">
                  <div className="relative w-8 h-8">
                    <span className="absolute top-1/2 left-0 w-8 h-[2px] bg-white rotate-45 group-hover:bg-race-accent transition-colors"></span>
                    <span className="absolute top-1/2 left-0 w-8 h-[2px] bg-white -rotate-45 group-hover:bg-race-accent transition-colors"></span>
                  </div>
                </button>
              </div>

              {/* MENU ITEMS */}
              <ul className="space-y-8 flex-1">
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
                            "inline-block text-4xl md:text-5xl font-display uppercase tracking-widest transition-all duration-300 hover:translate-x-4",
                            isActive ? "text-race-accent drop-shadow-[0_0_15px_rgba(212,255,0,0.5)]" : "text-white/50 hover:text-white"
                          )}
                        >
                          {item.name}
                        </a>
                      </motion.div>
                    </li>
                  )
                })}
              </ul>
              
              {/* FOOTER */}
              <div className="mt-auto pt-8 border-t border-white/10">
                <span className="font-display text-sm italic tracking-widest uppercase text-white/20">
                  RaceTime © 2026
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
