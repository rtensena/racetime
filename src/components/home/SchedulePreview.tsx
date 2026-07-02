"use client";

import { mockGrandPrix } from "@/lib/mockData";
import { format } from "date-fns";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export function SchedulePreview() {
  const nextGp = mockGrandPrix.find((gp) => gp.status === "Upcoming") || mockGrandPrix[0];
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      // Just fade in if reduced motion
      gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
      return;
    }

    // Scrubbing animation for the container (scaling and fading)
    gsap.fromTo(containerRef.current, 
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        }
      }
    );

    // Staggered reveal for cards with scrub
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100, rotateX: 45, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${80 - index * 10}%`,
            end: `top ${40 - index * 10}%`,
            scrub: true,
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="origin-bottom opacity-0">
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <h3 className="text-3xl md:text-5xl font-display uppercase tracking-widest">
          Race <span className="text-race-accent">Schedule</span>
        </h3>
        <Link
          href="/schedule"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          Full Calendar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-[1000px]">
        {nextGp.sessions.map((session, index) => {
          const sessionDate = new Date(session.date);
          const isLive = session.status === "Live";
          
          return (
            <div
              key={session.id}
              ref={el => { cardsRef.current[index] = el }}
              className="bg-race-gray/50 border border-white/5 rounded-xl p-6 hover:border-race-accent/50 hover:shadow-[0_20px_40px_rgba(212,255,0,0.15)] hover:bg-race-gray transition-all duration-300 group relative overflow-hidden transform-gpu hover:-translate-y-2 hover:scale-[1.02]"
            >
              {isLive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-race-accent animate-pulse" />
              )}
              
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-display uppercase tracking-wide text-white group-hover:text-race-accent transition-colors">
                  {session.name}
                </h4>
                {isLive ? (
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-race-accent">
                    <span className="w-2 h-2 rounded-full bg-race-accent animate-pulse" />
                    Live
                  </span>
                ) : (
                  <Clock className="w-5 h-5 text-white/20 group-hover:text-race-accent transition-colors transform group-hover:rotate-180 duration-500" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-3xl font-bold font-sans tracking-tight text-white group-hover:text-race-accent transition-colors">
                  {format(sessionDate, "HH:mm")}
                </p>
                <p className="text-sm text-white/40 font-medium uppercase tracking-wider">
                  {format(sessionDate, "EEEE, dd MMM")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
