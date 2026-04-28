"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

const BrainScene = dynamic(
  () => import("./brain-scene").then((m) => m.BrainScene),
  { ssr: false, loading: () => null },
);

export function LazyBrainShift() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {/* Pulsing orb — fades out when brain is ready */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: loaded ? 0 : 1 }}
        aria-hidden
      >
        <div className="w-24 h-24 rounded-full bg-violet-600/25 blur-2xl animate-pulse" />
      </div>
      {shouldMount ? (
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <BrainScene
            scale={0.4}
            autoRotate={false}
            showPulses={true}
            showPostProcessing={false}
            pulseCount={4}
            onLoaded={() => setLoaded(true)}
          />
        </Canvas>
      ) : null}
    </div>
  );
}
