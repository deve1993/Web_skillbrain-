"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const N_AGENTS = 18;
const RADIUS = 180;

export function AgentConstellation() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const agents = useMemo(() => {
    return Array.from({ length: N_AGENTS }, (_, i) => {
      const angle = (i / N_AGENTS) * Math.PI * 2;
      // Two concentric rings of agents
      const inner = i % 3 === 0;
      const r = inner ? RADIUS * 0.6 : RADIUS;
      return {
        i,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r * 0.55,
        size: inner ? 4 : 2.5,
        delay: i * 0.07,
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative" style={{ width: RADIUS * 2, height: RADIUS }}>
        {/* Concentric orbital rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/15"
          initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-[20%] rounded-full border border-cyan/15"
          initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />

        {/* Center core */}
        <motion.div
          className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-glow pulse-glow"
          initial={prefersReducedMotion ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        />

        {/* Agents */}
        {agents.map((a) => (
          <div
            key={a.i}
            className="absolute"
            style={{
              left: `calc(50% + ${a.x}px)`,
              top: `calc(50% + ${a.y}px)`,
              transform: "translate(-50%, -50%)",
              width: a.size * 2,
              height: a.size * 2,
            }}
          >
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor:
                  a.i % 5 === 0 ? "var(--color-cyan)" : "var(--color-accent)",
                boxShadow:
                  a.i % 5 === 0
                    ? "var(--shadow-glow-cyan)"
                    : "var(--shadow-glow)",
              }}
              initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.85 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + a.delay,
                ease: [0.19, 1, 0.22, 1],
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
