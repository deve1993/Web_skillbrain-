"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Node = {
  id: string;
  x: number;
  y: number;
  r: number;
  type: "fact" | "pattern" | "bugfix" | "decision" | "antipattern";
  delay: number;
};

type Edge = { from: string; to: string; delay: number };

const TYPE_COLOR: Record<Node["type"], string> = {
  fact: "var(--color-cyan)",
  pattern: "var(--color-accent)",
  bugfix: "var(--color-accent-soft)",
  decision: "#22d3ee",
  antipattern: "#9f7aea",
};

const RAW_NODES: Array<[string, number, number, number, Node["type"]]> = [
  ["m", 200, 100, 14, "decision"],
  ["a", 80, 50, 7, "fact"],
  ["b", 120, 150, 8, "pattern"],
  ["c", 280, 50, 7, "fact"],
  ["d", 320, 140, 8, "pattern"],
  ["e", 60, 130, 6, "bugfix"],
  ["f", 350, 80, 6, "antipattern"],
  ["g", 200, 180, 9, "pattern"],
  ["h", 30, 80, 5, "fact"],
  ["i", 380, 120, 5, "fact"],
  ["j", 240, 30, 5, "antipattern"],
  ["k", 160, 30, 5, "fact"],
];

const RAW_EDGES: Array<[string, string]> = [
  ["m", "a"],
  ["m", "b"],
  ["m", "c"],
  ["m", "d"],
  ["m", "g"],
  ["a", "h"],
  ["a", "k"],
  ["c", "j"],
  ["c", "f"],
  ["b", "e"],
  ["d", "i"],
  ["g", "b"],
  ["g", "d"],
];

export function KnowledgeGraph() {
  const prefersReducedMotion = useReducedMotion();

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = RAW_NODES.map(([id, x, y, r, type], i) => ({
      id,
      x,
      y,
      r,
      type,
      delay: i * 0.08,
    }));
    const edges: Edge[] = RAW_EDGES.map(([from, to], i) => ({
      from,
      to,
      delay: 0.4 + i * 0.05,
    }));
    return { nodes, edges };
  }, []);

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-full"
      role="img"
      aria-label="Knowledge graph visualization"
    >
      <defs>
        <radialGradient id="kg-pulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Edges */}
      <g>
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          return (
            <motion.line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-accent)"
              strokeOpacity="0.35"
              strokeWidth="0.8"
              initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.35 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: e.delay, ease: "easeOut" }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map((n) => (
          <motion.g
            key={n.id}
            initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: n.delay,
              ease: [0.19, 1, 0.22, 1],
            }}
            style={{ color: TYPE_COLOR[n.type], transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 2.6}
              fill="url(#kg-pulse)"
              opacity="0.5"
            />
            <circle cx={n.x} cy={n.y} r={n.r} fill="currentColor" opacity="0.92" />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
