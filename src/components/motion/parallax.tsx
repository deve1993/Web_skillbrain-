"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion
      ? ["0%", "0%"]
      : [`${speed * 100}%`, `${-speed * 100}%`],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
