"use client";

export function MarqueeStrip() {
  const phrase = "RACETIME HUB // ALWAYS BRINGING THE FIGHT // 2026 WORLD CHAMPIONSHIP // PIT WALL TELEMETRY // ";
  const repeated = phrase.repeat(6);

  return (
    <section 
      aria-label="Championship Slogan Marquee"
      className="w-full border-b border-white/10 bg-[#121210]/80 backdrop-blur-sm overflow-hidden py-4 select-none group"
    >
      <div className="flex w-max motion-reduce:transform-none">
        <div 
          className="inline-block whitespace-nowrap font-display font-black text-2xl sm:text-4xl uppercase tracking-widest text-[#E8E6E1]/90 group-hover:[animation-play-state:paused]"
          style={{
            animation: "marquee-scroll 32s linear infinite",
          }}
        >
          <span>{repeated}</span>
        </div>
        <div 
          className="inline-block whitespace-nowrap font-display font-black text-2xl sm:text-4xl uppercase tracking-widest text-[#E8E6E1]/90 group-hover:[animation-play-state:paused]"
          style={{
            animation: "marquee-scroll 32s linear infinite",
          }}
          aria-hidden="true"
        >
          <span>{repeated}</span>
        </div>
      </div>
    </section>
  );
}
