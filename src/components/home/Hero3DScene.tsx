"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Float, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary";

function HtmlLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-race-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-race-accent font-display uppercase tracking-widest text-sm whitespace-nowrap">
        Loading 3D Engine...
      </p>
    </div>
  );
}

function CanvasLoader() {
  return (
    <Html center>
      <HtmlLoader />
    </Html>
  );
}

function FallbackMessage() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black z-50">
      <h3 className="text-2xl font-display text-race-accent mb-4 uppercase tracking-widest">Model Not Found</h3>
      <p className="text-white/60 font-sans mb-4 max-w-md leading-relaxed">
        Silakan unduh model 3D F1 (format .glb) dari Sketchfab/CGTrader dan simpan di folder proyek Anda dengan nama:
      </p>
      <code className="bg-white/10 px-6 py-3 rounded-xl text-white font-mono text-lg border border-white/20">
        public/f1.glb
      </code>
    </div>
  );
}

function ExternalF1Car({ scrollProxy }: { scrollProxy: { progress: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/f1.glb");
  
  useFrame(() => {
    if (groupRef.current) {
      const p = scrollProxy.progress;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI / 6, -Math.PI / 2, p);
      groupRef.current.position.z = THREE.MathUtils.lerp(0, p > 0.8 ? (p - 0.8) * 20 : 0, p);
      groupRef.current.position.x = THREE.MathUtils.lerp(0, p > 0.8 ? -(p - 0.8) * 10 : 0, p);
    }
  });

  return (
    <group ref={groupRef} scale={1.2} position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}

function SceneCamera({ scrollProxy }: { scrollProxy: { progress: number } }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const p = scrollProxy.progress;
    camera.position.x = THREE.MathUtils.lerp(3, 5, p);
    camera.position.y = THREE.MathUtils.lerp(1.5, 2, p);
    camera.position.z = THREE.MathUtils.lerp(6, 4, p);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export function Hero3DScene({ scrollProxy }: { scrollProxy: { progress: number } }) {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} className="absolute inset-0 w-full h-full">
      <ErrorBoundary fallback={<FallbackMessage />}>
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-transparent">
            <HtmlLoader />
          </div>
        }>
          <Canvas eventSource={container} shadows dpr={[1, 1.5]} camera={{ position: [3, 1.5, 6], fov: 45 }} gl={{ powerPreference: "high-performance", antialias: false }}>
          <SceneCamera scrollProxy={scrollProxy} />
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
          <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={1} color="#D4FF00" />
          
          <Suspense fallback={<CanvasLoader />}>
            <ExternalF1Car scrollProxy={scrollProxy} />
          </Suspense>
          
          <Environment preset="city" />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.7} scale={20} blur={2.5} far={4} />
        </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Only preload if we know it's cheap, but since user said it's heavy, we REMOVE preload!
// useGLTF.preload("/f1.glb");
