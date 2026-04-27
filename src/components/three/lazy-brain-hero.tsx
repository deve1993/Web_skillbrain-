"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

const BrainScene = dynamic(
  () => import("./brain-scene").then((m) => m.BrainScene),
  { ssr: false, loading: () => null },
);

export function LazyBrainHero() {
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
    <div ref={ref} className="absolute inset-0">
      {shouldMount ? (
        <Canvas
          camera={{ position: [0, 0, 2.8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <BrainScene
            scale={1.5}
            autoRotate={true}
            showPulses={true}
            showPostProcessing={true}
          />
        </Canvas>
      ) : null}
    </div>
  );
}
