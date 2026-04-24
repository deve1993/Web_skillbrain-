"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Cell = { x: number; y: number; size: number; delay: number; tone: 0 | 1 | 2 };

const COLS = 18;
const ROWS = 8;
const PADDING_X = 10;
const PADDING_Y = 12;

export function SkillsCloud({ count = 253 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const cells = useMemo(() => {
    const cellW = (400 - PADDING_X * 2) / COLS;
    const cellH = (200 - PADDING_Y * 2) / ROWS;
    const out: Cell[] = [];
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (i >= count) break;
        const cx = PADDING_X + c * cellW + cellW / 2;
        const cy = PADDING_Y + r * cellH + cellH / 2;
        const size = 1.4 + ((c * 31 + r * 17) % 5) * 0.45;
        const delay = ((c + r) % 14) * 0.04;
        const tone = (((c + r * 3) % 7) === 0
          ? 1
          : ((c * 5 + r) % 11) === 0
            ? 2
            : 0) as 0 | 1 | 2;
        out.push({ x: cx, y: cy, size, delay, tone });
        i++;
      }
    }
    return out;
  }, [count]);

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-full"
      role="img"
      aria-label={`${count} skills cloud`}
    >
      <g>
        {cells.map((cell, i) => (
          <motion.circle
            key={i}
            cx={cell.x}
            cy={cell.y}
            r={cell.size}
            fill={
              cell.tone === 1
                ? "var(--color-cyan)"
                : cell.tone === 2
                  ? "var(--color-accent)"
                  : "var(--color-foreground)"
            }
            opacity={cell.tone === 0 ? 0.35 : 0.85}
            initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{
              scale: 1,
              opacity: cell.tone === 0 ? 0.35 : 0.85,
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.4,
              delay: cell.delay,
              ease: [0.19, 1, 0.22, 1],
            }}
          />
        ))}
      </g>
    </svg>
  );
}
