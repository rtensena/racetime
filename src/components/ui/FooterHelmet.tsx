"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls, Center, Html } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary";

function Loader() {
  return (
    <Html center>
      <div className="text-white text-xs font-mono whitespace-nowrap bg-black/50 px-3 py-1 rounded-full">
        Loading 3D Model...
      </div>
    </Html>
  );
}

function HelmetModel() {
  const { scene } = useGLTF("/models/helm.glb");
  const groupRef = useRef<THREE.Group>(null);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center scale={3}>
        <primitive object={copiedScene} />
      </Center>
    </group>
  );
}

export function FooterHelmet() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing relative">
      {container && (
        <ErrorBoundary fallback={<div className="text-white text-xs text-center mt-32">Failed to load 3D Model</div>}>
          <Canvas
            eventSource={container}
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          >
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} color="#D4FF00" />
              <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#ffffff" />
              
              <Environment preset="city" />

              <HelmetModel />

              <ContactShadows 
                position={[0, -1.5, 0]} 
                opacity={0.6} 
                scale={10} 
                blur={3} 
                far={4} 
                color="#000000"
              />

              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={2.5}
                maxPolarAngle={Math.PI / 2} 
                minPolarAngle={Math.PI / 3} 
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      )}
    </div>
  );
}

if (typeof window !== "undefined" && window.innerWidth >= 768) {
  useGLTF.preload("/models/helm.glb");
}
