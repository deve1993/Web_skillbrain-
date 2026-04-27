"use client";

import { motion, useReducedMotion } from "framer-motion";

const BEFORE_ITEMS = [
  { text: "// context lost", color: "text-red-500/40" },
  { text: "// session ended", color: "text-red-500/30" },
  { text: "// memory cleared", color: "text-orange-400/30" },
  { text: "// re-explaining...", color: "text-red-500/25" },
  { text: "// 4h wasted", color: "text-orange-400/20" },
];

const AFTER_ITEMS = [
  { text: "✓ context restored", color: "text-emerald-400/80" },
  { text: "✓ 247 memories active", color: "text-emerald-400/70" },
  { text: "✓ session resumed", color: "text-violet-400/80" },
  { text: "✓ memory persistent", color: "text-emerald-400/60" },
  { text: "✓ instant onboarding", color: "text-cyan-400/70" },
];

export function Shift() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="shift"
      className="relative border-y border-white/[0.06] overflow-hidden"
    >
      {/* Label */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <p className="font-mono uppercase tracking-[0.3em] text-[10px] text-white/30">
          02 — LA SVOLTA
        </p>
      </div>

      <div className="grid grid-cols-2 min-h-[80vh]">

        {/* ── PRIMA ── */}
        <div className="relative flex flex-col items-center justify-center px-8 py-24 border-r border-white/[0.06] overflow-hidden">
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.6) 3px,rgba(255,255,255,0.6) 4px)",
            }}
            aria-hidden
          />
          {/* Red noise vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.04)_0%,transparent_70%)]" aria-hidden />

          {/* Broken icon */}
          <div className="mb-8 text-red-500/40 font-mono text-xs tracking-wider border border-red-500/20 px-3 py-1 rounded">
            ERROR: no memory
          </div>

          {/* Floating error texts */}
          <div className="space-y-3 mb-10 w-full max-w-xs">
            {BEFORE_ITEMS.map((item, i) => (
              <motion.p
                key={item.text}
                className={`font-mono text-xs ${item.color}`}
                style={{ paddingLeft: `${(i % 3) * 12}px` }}
                animate={prefersReducedMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
              >
                {item.text}
              </motion.p>
            ))}
          </div>

          {/* Headline */}
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">prima</p>
            <p className="font-display text-3xl md:text-4xl text-white/30 leading-tight">
              Ogni sessione,<br />ricomincia da zero.
            </p>
          </div>
        </div>

        {/* ── DOPO ── */}
        <div className="relative flex flex-col items-center justify-center px-8 py-24 overflow-hidden">
          {/* Cyan/violet glow bg */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(124,58,237,0.08)_0%,rgba(6,182,212,0.04)_50%,transparent_80%)]" aria-hidden />

          {/* Brain glow orb */}
          <div className="relative mb-8">
            <motion.div
              className="w-28 h-28 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(6,182,212,0.4) 50%, transparent 75%)",
                boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(6,182,212,0.25), 0 0 120px rgba(124,58,237,0.15)",
              }}
              animate={prefersReducedMotion ? undefined : {
                scale: [1, 1.12, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Orbiting ring */}
            <motion.div
              className="absolute inset-[-12px] rounded-full border border-violet-400/20"
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[-24px] rounded-full border border-cyan-400/10"
              animate={prefersReducedMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Status items */}
          <div className="space-y-2 mb-10 w-full max-w-xs">
            {AFTER_ITEMS.map((item, i) => (
              <motion.p
                key={item.text}
                className={`font-mono text-xs ${item.color}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
              >
                {item.text}
              </motion.p>
            ))}
          </div>

          {/* Headline */}
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">dopo</p>
            <p className="font-display text-3xl md:text-4xl text-foreground leading-tight">
              La memoria persiste.<br />Il lavoro continua.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal mid-line */}
      <div
        className="absolute left-0 right-0 top-[49%] h-px pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.25) 30%, rgba(6,182,212,0.25) 70%, transparent)" }}
        aria-hidden
      />
    </section>
  );
}
