import React from "react";

interface CircuitSvgProps {
  name?: string;
  className?: string;
}

// Clean single-stroke SVG circuit outlines (no fill, stroke only)
export function CircuitSvg({ name = "", className = "w-24 h-16" }: CircuitSvgProps) {
  const n = name.toLowerCase();

  // São Paulo / Interlagos
  if (n.includes("são paulo") || n.includes("brazil") || n.includes("pace") || n.includes("interlagos")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,60 L45,60 C55,60 62,56 65,48 L72,32 C75,25 82,20 90,20 L102,20 C108,20 110,25 106,30 L95,42 C90,48 92,55 98,58 L104,60 C108,62 106,68 100,68 L50,68 C40,68 35,62 30,55 L22,40 C18,30 22,22 30,22 L55,22 C62,22 66,28 62,34 L52,48 C48,54 40,58 30,58 Z" />
      </svg>
    );
  }

  // Las Vegas Strip
  if (n.includes("vegas")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15,20 L95,20 C105,20 108,26 102,32 L85,48 C80,53 82,62 90,64 L105,64 C108,64 108,70 102,70 L25,70 C15,70 15,62 22,55 L35,42 C38,38 35,30 25,30 L15,30 C10,30 10,20 15,20 Z" />
      </svg>
    );
  }

  // Lusail Qatar
  if (n.includes("qatar") || n.includes("lusail")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,25 L90,25 C100,25 105,32 98,40 L75,60 C68,66 58,66 50,60 L28,45 C20,38 22,30 30,28 L70,28 C78,28 80,35 74,42 L65,50 C58,55 48,55 42,50 L25,35 Z" />
      </svg>
    );
  }

  // Yas Marina Abu Dhabi
  if (n.includes("abu dhabi") || n.includes("yas marina")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18,22 L82,22 C92,22 98,28 92,36 L80,50 C75,56 78,65 86,66 L102,66 C106,66 105,72 98,72 L35,72 C22,72 18,62 25,52 L42,32 C48,24 40,22 30,22 Z" />
      </svg>
    );
  }

  // Silverstone
  if (n.includes("silverstone") || n.includes("british")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,35 L40,18 C46,14 55,15 62,20 L95,45 C102,50 100,60 92,62 L45,66 C35,67 28,60 25,52 L15,38 C14,32 18,28 24,28 Z" />
      </svg>
    );
  }

  // Monza
  if (n.includes("monza") || n.includes("italian")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,30 L95,20 C105,18 108,28 100,35 L85,45 C78,50 82,60 92,62 L60,65 C40,66 25,60 20,48 Z" />
      </svg>
    );
  }

  // Spa-Francorchamps
  if (n.includes("spa") || n.includes("belgian")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18,50 L35,22 C40,15 50,15 58,22 L85,45 C92,50 102,48 105,40 L102,28 C98,22 105,18 110,24 L108,55 C105,65 95,68 85,62 L40,62 C28,62 18,58 18,50 Z" />
      </svg>
    );
  }

  // Monaco
  if (n.includes("monaco")) {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,45 C18,30 28,20 42,20 L80,22 C92,23 98,32 90,40 L70,55 C65,60 55,62 45,58 L30,52 C22,48 18,52 20,45 Z" />
      </svg>
    );
  }

  // Generic technical racing circuit loop
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22,30 L55,20 C65,16 75,20 82,28 L98,42 C104,48 102,58 92,62 L60,66 C45,68 35,60 28,50 L18,38 C15,32 18,28 22,30 Z" />
    </svg>
  );
}
