"use client";

import { CountUp } from "@/components/motion/count-up";

export function PillarStat({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono text-xs text-muted tabular-nums">
      <CountUp end={value} /> {label}
    </span>
  );
}
