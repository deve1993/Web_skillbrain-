"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LazyBrainShift } from "@/components/three/lazy-brain-shift";

const BEFORE_TEXTS = [
  "// context lost",
  "// session ended",
  "// memory cleared",
  "// re-explaining...",
  "// 4h wasted",
];

const AFTER_TEXTS = [
  "✓ context restored",
  "✓ memory persistent",
  "✓ session resumed",
  "✓ 247 memories",
  "✓ instant onboarding",
];

type FloatingTextProps = {
  texts: string[];
  side: "before" | "after";
};

function FloatingTexts({ texts, side }: FloatingTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAfter = side === "after";

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 pointer-events-none select-none">
      {texts.map((text, i) => (
        <motion.p
          key={text}
          className={`font-mono text-xs ${
            isAfter
              ? "text-white/60"
              : "text-white/20"
          }`}
          style={{
            transform: `translateX(${(i % 2 === 0 ? -1 : 1) * (8 + i * 4)}px)`,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, (i % 2 === 0 ? -1 : 1) * 4, 0],
                }
          }
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {text}
        </motion.p>
      ))}
    </div>
  );
}

export function Shift() {
  return (
    <section
      id="shift"
      className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-y border-white/[0.06] bg-[#050509]"
    >
      {/* Section label */}
      <div className="relative z-10 mb-0 pt-16 pb-8 text-center w-full">
        <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/40">
          02 — LA SVOLTA
        </p>
      </div>

      {/* Split panel */}
      <div className="relative z-10 w-full flex-1 grid grid-cols-2 divide-x divide-white/[0.06] min-h-[60vh]">
        {/* Left — Before */}
        <div className="relative bg-[#050509] flex items-center justify-center overflow-hidden">
          <FloatingTexts texts={BEFORE_TEXTS} side="before" />
          {/* Subtle scanline texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center px-8 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-6">prima</p>
            <p className="font-display text-3xl md:text-4xl text-white/30 leading-tight">
              Ogni sessione,<br />ricomincia da zero.
            </p>
          </div>
        </div>

        {/* Right — After */}
        <div className="relative bg-[#050509] flex items-center justify-center overflow-hidden">
          {/* Mini brain scene */}
          <div className="absolute inset-0">
            <LazyBrainShift />
          </div>

          {/* After texts with brain glow lines */}
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 pointer-events-none select-none z-10">
            {AFTER_TEXTS.map((text, i) => (
              <motion.p
                key={text}
                className="font-mono text-xs text-white/60 flex items-center gap-2"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.12 + 0.3 }}
              >
                <span
                  className="inline-block w-4 h-px opacity-60"
                  style={{
                    background: i % 2 === 0
                      ? "linear-gradient(90deg, #7c3aed, transparent)"
                      : "linear-gradient(90deg, #06b6d4, transparent)",
                  }}
                  aria-hidden
                />
                {text}
              </motion.p>
            ))}
          </div>

          <div className="relative z-10 text-center px-8 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-6">dopo</p>
            <p className="font-display text-3xl md:text-4xl text-white/80 leading-tight">
              La memoria persiste.<br />Il lavoro continua.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal mid-line connector */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px pointer-events-none z-20"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.3) 25%, rgba(6,182,212,0.3) 75%, transparent 100%)",
        }}
        aria-hidden
      />
    </section>
  );
}
