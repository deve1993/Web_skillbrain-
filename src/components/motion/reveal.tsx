"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "footer" | "span";
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const off = offsets[direction];
  const Tag = motion[as];

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x: off.x, y: off.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </Tag>
  );
}
