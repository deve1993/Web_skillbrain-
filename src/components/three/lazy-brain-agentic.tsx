"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

const BrainScene = dynamic(
  () => import("./brain-scene").then((m) => m.BrainScene),
  { ssr: false, loading: () => null },
);

export function LazyBrainAgentic() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

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
      { rootMargin: "200px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {shouldMount ? (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <BrainScene
            scale={0.5}
            autoRotate={false}
            showPulses={false}
            showPostProcessing={false}
          />
        </Canvas>
      ) : null}
    </div>
  );
}
