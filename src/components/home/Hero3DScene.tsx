"use client";

import { useRef, Suspense, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary";

function FallbackBackdrop() {
  return (
    <div className="fixed inset-0 bg-[#0D0D0C] flex items-center justify-center pointer-events-none">
      <div className="w-full h-full opacity-10 bg-[radial-gradient(#E8462E_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}

function F1CarModel({
  mousePos,
  scrollProgress,
}: {
  mousePos: { x: number; y: number };
  scrollProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/f1.glb");
  const { size } = useThree();

  const isMobile = size.width < 768;
  const modelScale = isMobile ? 0.65 : 1.15;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Dynamic rotation mapped across full page scroll:
      // At top (p=0): front-3/4 angle
      // Mid scroll (p=0.4): turns into sweeping cornering profile
      // Late scroll (p=0.8): high speed tracking angle
      const scrollRotY = THREE.MathUtils.lerp(-Math.PI / 8, Math.PI * 0.85, scrollProgress);
      const scrollPosX = THREE.MathUtils.lerp(isMobile ? 0 : 0.8, isMobile ? -0.5 : -1.8, scrollProgress);
      const scrollPosZ = THREE.MathUtils.lerp(0, -2, scrollProgress);

      // Interactive mouse influence for "playing" with the 3D car
      const targetRotY = scrollRotY + mousePos.x * 0.45;
      const targetRotX = mousePos.y * 0.2 + 0.05;

      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 2.5, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 2.5, delta);
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, scrollPosX, 2, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, scrollPosZ, 2, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, isMobile ? -0.3 : -0.5, 2, delta);
    }
  });

  return (
    <group ref={groupRef} scale={modelScale} position={[0, -0.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.12}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Dynamic camera movements across the entire page journey
    const targetX = THREE.MathUtils.lerp(2.8, 4.2, scrollProgress);
    const targetY = THREE.MathUtils.lerp(1.3, 2.5, scrollProgress);
    const targetZ = THREE.MathUtils.lerp(5.4, 4.6, scrollProgress);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Hero3DScene() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Global scroll listener for full-page car animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const p = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        setScrollProgress(p);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global mouse tracking so user can play with car anywhere on page
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={setContainer}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      {container && (
        <ErrorBoundary fallback={<FallbackBackdrop />}>
          <Suspense fallback={null}>
            <Canvas
              eventSource={container}
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [2.8, 1.3, 5.4], fov: 42 }}
              gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <CameraRig scrollProgress={scrollProgress} />
              
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 15, 8]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
              <directionalLight position={[-10, 8, -5]} intensity={1.2} color="#E8462E" />
              <spotLight position={[0, 12, 0]} intensity={1.5} angle={0.6} penumbra={0.8} />

              <Suspense fallback={null}>
                <F1CarModel mousePos={mousePos} scrollProgress={scrollProgress} />
              </Suspense>

              <Environment preset="city" />
              <ContactShadows
                position={[0, -0.6, 0]}
                opacity={0.8}
                scale={18}
                blur={2.2}
                far={4}
                color="#000000"
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Subtle vignette layer that softens edges without muddying content */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0C]/80 via-transparent to-[#0D0D0C]/60 pointer-events-none" />
    </div>
  );
}
