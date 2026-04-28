"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { GraphNodeData, GraphEdge } from "./graph-data";

const CodebaseGraph3D = dynamic(
  () => import("./codebase-graph").then((m) => m.CodebaseGraph3D),
  { ssr: false, loading: () => null },
);

export function LazyCodebaseGraph({
  nodes, edges, hoveredId, selectedId, onHover, onSelect,
}: {
  nodes: GraphNodeData[];
  edges: GraphEdge[];
  hoveredId: number | null;
  selectedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}) {
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
        <CodebaseGraph3D
          nodes={nodes}
          edges={edges}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={onHover}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}
