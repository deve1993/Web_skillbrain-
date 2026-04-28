"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LazyBrainMini } from "@/components/three/lazy-brain-mini";

const BEFORE_ITEMS = [
  { text: "// context lost",      color: "text-red-500/60" },
  { text: "// session ended",     color: "text-red-500/50" },
  { text: "// memory cleared",    color: "text-orange-400/45" },
  { text: "// re-explaining...",  color: "text-red-400/40" },
  { text: "// 4h wasted",         color: "text-red-500/35" },
];

const AFTER_ITEMS = [
  { text: "✓ context restored",     color: "text-emerald-400" },
  { text: "✓ 247 memories active",  color: "text-emerald-400/90" },
  { text: "✓ session resumed",      color: "text-violet-300" },
  { text: "✓ memory persistent",    color: "text-emerald-400/80" },
  { text: "✓ instant onboarding",   color: "text-cyan-300/90" },
];

export function Shift() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="shift"
      className="relative py-28 md:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Section label */}
        <div className="text-center mb-16">
          <p className="font-mono uppercase tracking-[0.3em] text-[10px] text-white/30">
            02 — LA SVOLTA
          </p>
        </div>

        {/* ── Two cards ── */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">

          {/* PRIMA */}
          <div className="relative rounded-2xl border border-red-500/10 bg-[#0a0608] p-8 md:p-10 overflow-hidden flex flex-col">
            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,80,80,0.5) 3px,rgba(255,80,80,0.5) 4px)",
              }}
              aria-hidden
            />
            {/* Red radial */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(239,68,68,0.09) 0%, transparent 70%)" }}
              aria-hidden
            />

            {/* Top: label + badge */}
            <div className="flex items-center justify-between mb-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">prima</p>
              <span className="font-mono text-[10px] text-red-500/60 border border-red-500/20 px-2.5 py-1 rounded">
                ERROR: no memory
              </span>
            </div>

            {/* Error lines */}
            <div className="space-y-3 flex-1">
              {BEFORE_ITEMS.map((item, i) => (
                <motion.p
                  key={item.text}
                  className={`font-mono text-sm ${item.color}`}
                  style={{ paddingLeft: `${(i % 3) * 14}px` }}
                  animate={prefersReducedMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.7 }}
                >
                  {item.text}
                </motion.p>
              ))}
            </div>

            {/* Headline */}
            <div className="mt-10 pt-8 border-t border-red-500/10">
              <p className="font-display text-5xl md:text-6xl text-foreground leading-[0.95]">
                Ogni sessione,<br />ricomincia<br />da zero.
              </p>
            </div>
          </div>

          {/* DOPO */}
          <div className="relative rounded-2xl border border-violet-500/20 bg-[#08060f] p-8 md:p-10 overflow-hidden flex flex-col">
            {/* Violet glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 80% 0%, rgba(124,58,237,0.14) 0%, rgba(6,182,212,0.06) 55%, transparent 80%)" }}
              aria-hidden
            />

            {/* Top: label + orb decoration */}
            <div className="flex items-center justify-between mb-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">dopo</p>
              {/* Mini brain */}
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <LazyBrainMini />
              </div>
            </div>

            {/* Status lines */}
            <div className="space-y-3 flex-1">
              {AFTER_ITEMS.map((item, i) => (
                <motion.p
                  key={item.text}
                  className={`font-mono text-sm ${item.color}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
                >
                  {item.text}
                </motion.p>
              ))}
            </div>

            {/* Headline */}
            <div className="mt-10 pt-8 border-t border-violet-500/15">
              <p className="font-display text-5xl md:text-6xl text-foreground leading-[0.95]">
                La memoria persiste.<br />Il lavoro<br />continua.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
