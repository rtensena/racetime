"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Environment, Float, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { AlertCircle, Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

const circuitToSvg: Record<string, string> = {
  "Bahrain International Circuit": "/tracks/bahrain-3.svg",
  "Jeddah Corniche Circuit": "/tracks/jeddah-1.svg",
  "Albert Park Grand Prix Circuit": "/tracks/melbourne-2.svg",
  "Suzuka Circuit": "/tracks/suzuka-2.svg",
  "Shanghai International Circuit": "/tracks/shanghai-1.svg",
  "Miami International Autodrome": "/tracks/miami-1.svg",
  "Autodromo Enzo e Dino Ferrari": "/tracks/imola-3.svg",
  "Circuit de Monaco": "/tracks/monaco-6.svg",
  "Circuit Gilles Villeneuve": "/tracks/montreal-6.svg",
  "Circuit de Barcelona-Catalunya": "/tracks/catalunya-6.svg",
  "Red Bull Ring": "/tracks/spielberg-3.svg",
  "Silverstone Circuit": "/tracks/silverstone-8.svg",
  "Hungaroring": "/tracks/hungaroring-3.svg",
  "Circuit de Spa-Francorchamps": "/tracks/spa-francorchamps-4.svg",
  "Circuit Zandvoort": "/tracks/zandvoort-5.svg",
  "Autodromo Nazionale Monza": "/tracks/monza-7.svg",
  "Baku City Circuit": "/tracks/baku-1.svg",
  "Marina Bay Street Circuit": "/tracks/marina-bay-4.svg",
  "Circuit of the Americas": "/tracks/austin-1.svg",
  "Autódromo Hermanos Rodríguez": "/tracks/mexico-city-3.svg",
  "Autódromo José Carlos Pace": "/tracks/interlagos-2.svg",
  "Las Vegas Strip Street Circuit": "/tracks/las-vegas-1.svg",
  "Lusail International Circuit": "/tracks/lusail-1.svg",
  "Yas Marina Circuit": "/tracks/yas-marina-2.svg"
};

function Track3DModel({ svgUrl }: { svgUrl: string }) {
  const [curve, setCurve] = useState<THREE.CatmullRomCurve3 | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useEffect(() => {
    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch SVG");
        return res.text();
      })
      .then((svgText) => {
        const loader = new SVGLoader();
        const svgData = loader.parse(svgText);
        
        const allPoints: THREE.Vector3[] = [];
        
        svgData.paths.forEach((path) => {
          path.subPaths.forEach((subPath) => {
            const points = subPath.getPoints();
            points.forEach((p) => {
              // SVGs are usually top-left origin, Y goes down.
              // In ThreeJS, Y goes up. We invert Y here.
              allPoints.push(new THREE.Vector3(p.x, -p.y, 0));
            });
          });
        });

        if (allPoints.length > 0) {
          // Check if path should be closed
          const isClosed = allPoints[0].distanceTo(allPoints[allPoints.length - 1]) < 10;
          const trackCurve = new THREE.CatmullRomCurve3(allPoints, isClosed, "catmullrom", 0.5);
          setCurve(trackCurve);
        }
      })
      .catch((e) => console.error(e));
  }, [svgUrl]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Create a glowing pulsing effect on the track
      const t = clock.getElapsedTime();
      const intensity = 2 + Math.sin(t * 3) * 1.5;
      materialRef.current.emissiveIntensity = intensity;
    }
    if (meshRef.current) {
      // Slowly rotate the track automatically
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  if (!curve) return null;

  return (
    <group scale={0.02}>
      <Center>
        {/* We rotate the entire track so it lies flat on the floor */}
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          {/* Tube geometry created from the SVG path */}
          <tubeGeometry args={[curve, 500, 4, 8, curve.closed]} />
          
          <meshPhysicalMaterial 
            ref={materialRef}
            color="#0a0a0a" 
            emissive="#D4FF00"
            emissiveIntensity={2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
          />
        </mesh>
      </Center>
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-race-accent animate-spin" />
        <span className="text-white/60 font-display uppercase tracking-widest text-xs whitespace-nowrap">Loading Track...</span>
      </div>
    </Html>
  );
}

function ErrorFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-race-gray/20 border border-white/5 rounded-2xl">
      <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
      <p className="text-sm font-bold uppercase tracking-widest text-white/40 text-center">
        3D Track Layout Not Available
      </p>
    </div>
  );
}

export function TrackMap({ circuitName }: { circuitName: string }) {
  const svgUrl = circuitToSvg[circuitName] || "/tracks/bahrain-3.svg"; // Fallback to Bahrain if unknown

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-transparent group rounded-[2rem] overflow-hidden">
      
      {/* 3D Hint text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Drag to rotate • Scroll to zoom</span>
      </div>

      <ErrorBoundary fallback={<ErrorFallback />}>
        <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          
          <ambientLight intensity={0.4} />
          <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />
          <spotLight position={[-10, 10, -10]} angle={0.5} penumbra={1} intensity={1} color="#D4FF00" />
          
          <Suspense fallback={<LoadingFallback />}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <Track3DModel svgUrl={svgUrl} />
            </Float>
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              maxPolarAngle={Math.PI / 2 - 0.1} 
              minPolarAngle={0}
              minDistance={3}
              maxDistance={30}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>

          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={30} blur={2.5} far={10} color="#000000" />
          <Environment preset="city" />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
