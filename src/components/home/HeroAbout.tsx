"use client";

import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

// Dynamically import the 3D Scene with SSR disabled.
// This prevents ThreeJS from blocking the initial page load and hydrates it instantly.
const Hero3DSceneLazy = dynamic(
  () => import("./Hero3DScene").then((mod) => mod.Hero3DScene),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black z-0">
        <div className="w-12 h-12 border-4 border-race-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-race-accent font-display uppercase tracking-widest text-sm whitespace-nowrap">
          Warming up tires...
        </p>
      </div>
    )
  }
);

export function HeroAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  // We use useMemo so the proxy reference is stable across renders 
  // and can be passed down to the lazy-loaded Canvas safely.
  const scrollProxy = useMemo(() => ({ progress: 0 }), []);

  useGSAP(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    scrollProxy.progress = 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });

    // 1. Link GSAP progress to ThreeJS proxy over the entire 300vh scroll
    tl.to(scrollProxy, {
      progress: 1,
      ease: "none",
    }, 0);

    // 2. Text Sequence Animations
    // Text 1 fades out quickly
    tl.to(text1Ref.current, { opacity: 0, y: -50, duration: 0.2 }, 0);
    
    // Text 2 fades in, then fades out
    tl.fromTo(text2Ref.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 0.2 }, 
      0.2
    );
    tl.to(text2Ref.current, { opacity: 0, y: -50, duration: 0.2 }, 0.5);

    // Text 3 fades in at the end
    tl.fromTo(text3Ref.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3 },
      0.6
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-black" style={{ height: "300vh" }}>
      
      {/* Sticky Container - Stays fixed on screen while scrolling through the 300vh */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background 3D Canvas (Lazy Loaded) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Hero3DSceneLazy scrollProxy={scrollProxy} />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-0 pointer-events-none" />

        {/* Foreground Text Sequences */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center container mx-auto px-4 md:px-8 text-center pointer-events-none">
          
          {/* Text 1: Appears on load */}
          <div ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-display uppercase tracking-widest text-white mb-6 drop-shadow-2xl">
              Welcome to <br />
              <span className="text-race-accent">RaceTime</span>
            </h1>
            <p className="text-lg md:text-xl font-sans font-bold text-white/60 uppercase tracking-widest">
              Scroll to start the engine
            </p>
          </div>

          {/* Text 2: Appears midway */}
          <div ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-widest text-white mb-6 drop-shadow-2xl">
              Precision & <span className="text-race-accent">Speed</span>
            </h2>
            <p className="text-xl md:text-2xl font-sans font-medium text-white/80 leading-relaxed max-w-2xl drop-shadow-lg">
              Experience the pinnacle of motorsport data. Real-time standings, complete calendars, and dynamic track layouts in a stunning cinematic interface.
            </p>
          </div>

          {/* Text 3: Appears at the end of the section */}
          <div ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 mt-32">
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-widest text-white drop-shadow-2xl">
              Prepare for <span className="text-race-accent">Lights Out</span>
            </h2>
          </div>

        </div>

      </div>
    </section>
  );
}
