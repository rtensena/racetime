"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/Skeleton";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

export function StandingsPreview() {
  const { data: drivers, isLoading } = useQuery({
    queryKey: ["standings", "drivers", "2024"],
    queryFn: () => api.getDriverStandings("2024")
  });
  const topDrivers = drivers?.slice(0, 3);
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    // Pin the section and scrub the cards
    gsap.fromTo(cardsRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=500", // pin for 500px of scrolling
          pin: true,
          scrub: true,
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-12 md:py-24">
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <h3 className="text-3xl md:text-5xl font-display uppercase tracking-widest">
          Top <span className="text-race-accent">Drivers</span>
        </h3>
        <Link
          href="/standings"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          Full Standings
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-24 rounded-xl border border-white/5" />
            <Skeleton className="w-full h-24 rounded-xl border border-white/5" />
            <Skeleton className="w-full h-24 rounded-xl border border-white/5" />
          </>
        ) : (
          <AnimatePresence>
            {topDrivers?.map((driver, index) => (
              <motion.div
                key={driver.driverId}
                layout
                ref={el => { cardsRef.current[index] = el }}
                className="flex items-center bg-race-gray/40 border border-white/5 rounded-xl p-4 md:p-6 hover:shadow-[0_0_30px_rgba(212,255,0,0.15)] hover:border-race-accent/40 transition-colors group cursor-pointer"
              >
                <div className="w-12 text-center flex flex-col items-center justify-center">
                  {index === 0 && <Trophy className="w-5 h-5 text-race-accent mb-1 group-hover:scale-125 transition-transform" />}
                  <span className={`text-3xl font-display transition-colors ${
                    index === 0 ? "text-race-accent" : "text-white/20 group-hover:text-race-accent"
                  }`}>
                    {driver.position}
                  </span>
                </div>

                <div className="flex-1 ml-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-white/80 transition-colors">
                    {driver.firstName}
                  </p>
                  <p className="text-2xl md:text-3xl font-display uppercase tracking-wider text-white group-hover:text-race-accent transition-colors">
                    {driver.lastName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">
                    {driver.team}
                  </p>
                  <p className="text-4xl font-display text-white group-hover:scale-110 origin-right transition-transform">
                    {driver.points} <span className="text-lg text-white/40 font-sans tracking-widest">PTS</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
