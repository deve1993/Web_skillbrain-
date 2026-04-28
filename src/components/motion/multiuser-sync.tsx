"use client";

import { motion, useReducedMotion } from "framer-motion";

const USERS = [
  { id: "u1", x: 60, y: 52, label: "Milano", role: "Lead Dev" },
  { id: "u2", x: 340, y: 52, label: "Praha", role: "Senior" },
  { id: "u3", x: 60, y: 152, label: "Berlin", role: "Full-stack" },
  { id: "u4", x: 340, y: 152, label: "Lisboa", role: "CTO" },
];

const CENTER = { x: 200, y: 102 };

export function MultiUserSync() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 204"
      className="w-full h-full"
      role="img"
      aria-label="Multi-user sync visualization"
    >
      <defs>
        <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="user-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connecting lines */}
      <g>
        {USERS.map((u, i) => (
          <motion.line
            key={u.id}
            x1={u.x}
            y1={u.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke="var(--color-accent)"
            strokeOpacity="0.35"
            strokeWidth="0.9"
            strokeDasharray="3 5"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.35 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* Animated pulses traveling to center */}
      <g>
        {USERS.map((u, i) => (
          <motion.circle
            key={`pulse-${u.id}`}
            r={3.5}
            fill="var(--color-cyan)"
            initial={prefersReducedMotion ? false : { cx: u.x, cy: u.y, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? false
                : {
                    cx: [u.x, CENTER.x],
                    cy: [u.y, CENTER.y],
                    opacity: [0, 1, 1, 0],
                    scale: [0.6, 1, 1, 0.6],
                  }
            }
            transition={{
              duration: 1.8,
              delay: 1.1 + i * 0.55,
              repeat: Infinity,
              repeatDelay: 1.8,
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
        transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
      >
        <circle cx={CENTER.x} cy={CENTER.y} r={48} fill="url(#brain-glow)" />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={22}
          fill="var(--color-accent)"
          opacity="0.18"
        />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={17}
          fill="var(--color-accent)"
          opacity="0.95"
        />
        <text
          x={CENTER.x}
          y={CENTER.y - 2}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="600"
          fill="var(--color-background)"
          fontFamily="ui-monospace, monospace"
          style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          TEAM
        </text>
        <text
          x={CENTER.x}
          y={CENTER.y + 8}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="600"
          fill="var(--color-background)"
          fontFamily="ui-monospace, monospace"
          style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          BRAIN
        </text>

        {/* Synced badge */}
        <rect
          x={CENTER.x - 22}
          y={CENTER.y - 40}
          width={44}
          height={14}
          rx={7}
          fill="var(--color-surface)"
          stroke="var(--color-cyan)"
          strokeWidth="0.8"
          strokeOpacity="0.7"
        />
        <circle
          cx={CENTER.x - 12}
          cy={CENTER.y - 33}
          r={2}
          fill="var(--color-cyan)"
          opacity="0.9"
        />
        <text
          x={CENTER.x + 1}
          y={CENTER.y - 29.5}
          textAnchor="middle"
          fontSize="6.5"
          fill="var(--color-cyan)"
          fontFamily="ui-monospace, monospace"
        >
          4 synced
        </text>
      </motion.g>

      {/* User nodes */}
      <g>
        {USERS.map((u, i) => {
          const above = u.y < CENTER.y;
          const cityY = above ? u.y - 17 : u.y + 22;
          const roleY = above ? u.y - 26 : u.y + 33;
          return (
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
              style={{ transformOrigin: `${u.x}px ${u.y}px` }}
            >
              <circle cx={u.x} cy={u.y} r={22} fill="url(#user-glow)" />
              <circle
                cx={u.x}
                cy={u.y}
                r={10}
                fill="var(--color-surface-elevated)"
                stroke="var(--color-cyan)"
                strokeWidth="1.5"
              />
              <text
                x={u.x}
                y={cityY}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--color-muted)"
                fontFamily="ui-monospace, monospace"
                style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                {u.label}
              </text>
              <text
                x={u.x}
                y={roleY}
                textAnchor="middle"
                fontSize="7"
                fill="var(--color-subtle)"
                fontFamily="ui-monospace, monospace"
              >
                {u.role}
              </text>
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
