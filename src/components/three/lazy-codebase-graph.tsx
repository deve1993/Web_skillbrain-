"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CodebaseGraph3D = dynamic(
  () => import("./codebase-graph").then((m) => m.CodebaseGraph3D),
  { ssr: false, loading: () => null },
);

export function LazyCodebaseGraph() {
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
      {shouldMount ? <CodebaseGraph3D /> : null}
    </div>
  );
}
