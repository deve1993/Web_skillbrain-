"use client";

import { motion, useReducedMotion } from "framer-motion";

const USERS = [
  { id: "u1", x: 60, y: 50, label: "Milano" },
  { id: "u2", x: 340, y: 50, label: "Praha" },
  { id: "u3", x: 60, y: 150, label: "Berlin" },
  { id: "u4", x: 340, y: 150, label: "Lisboa" },
];

const CENTER = { x: 200, y: 100 };

export function MultiUserSync() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-full"
      role="img"
      aria-label="Multi-user sync visualization"
    >
      <defs>
        <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connecting lines from users to center brain */}
      <g>
        {USERS.map((u, i) => (
          <motion.line
            key={u.id}
            x1={u.x}
            y1={u.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke="var(--color-accent)"
            strokeOpacity="0.4"
            strokeWidth="0.8"
            strokeDasharray="3 4"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* Animated pulses traveling from users to center */}
      <g>
        {USERS.map((u, i) => (
          <motion.circle
            key={`pulse-${u.id}`}
            r={2}
            fill="var(--color-cyan)"
            initial={prefersReducedMotion ? false : { cx: u.x, cy: u.y, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? false
                : {
                    cx: [u.x, CENTER.x],
                    cy: [u.y, CENTER.y],
                    opacity: [0, 1, 1, 0],
                  }
            }
            transition={{
              duration: 2,
              delay: 1.2 + i * 0.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>

      {/* Center brain */}
      <motion.g
        initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
      >
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={36}
          fill="url(#brain-glow)"
        />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={14}
          fill="var(--color-accent)"
          opacity="0.95"
        />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={6}
          fill="var(--color-foreground)"
          opacity="0.9"
        />
      </motion.g>

      {/* User nodes */}
      <g>
        {USERS.map((u, i) => (
          <motion.g
            key={`user-${u.id}`}
            initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + i * 0.1,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <circle
              cx={u.x}
              cy={u.y}
              r={9}
              fill="var(--color-surface-elevated)"
              stroke="var(--color-cyan)"
              strokeWidth="1.5"
            />
            <text
              x={u.x}
              y={u.y + (u.y < 100 ? -16 : 22)}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-muted)"
              fontFamily="ui-monospace, monospace"
              style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              {u.label}
            </text>
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
