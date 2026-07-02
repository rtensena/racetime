"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      syncTouch: true,
      smoothWheel: true,
    });

    setLenis(lenisInstance);
    gsap.ticker.lagSmoothing(0);
    
    const ticker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  useGSAP(() => {
    // Scroll progress indicator
    gsap.to(indicatorRef.current, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });
  }, { scope: indicatorRef });

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [pathname, lenis]);

  return (
    <>
      <div 
        ref={indicatorRef}
        className="fixed top-0 left-0 h-[2px] bg-race-accent z-[9999] w-0 pointer-events-none drop-shadow-[0_0_10px_rgba(212,255,0,0.8)]" 
      />
      {children}
    </>
  );
}
