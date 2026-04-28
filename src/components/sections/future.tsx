"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { LazyBrainAgentic } from "@/components/three/lazy-brain-agentic";
import { AGENTIC_THREADS } from "@/lib/agentic-tasks";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* ── SVG connector lines with animated traveling dot ── */
const PATHS = [
  "M500,0 C500,35 165,55 165,90",   // → card sinistra
  "M500,0 L500,90",                   // → card centro
  "M500,0 C500,35 835,55 835,90",   // → card destra
] as const;

const LINE_COLORS = ["#7c3aed", "#06b6d4", "#9f7aea"] as const;
const DOT_COLORS  = ["#a78bfa", "#22d3ee", "#c4b5fd"] as const;

function ConnectorLines() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1000 90"
      preserveAspectRatio="none"
      className="w-full h-16 md:h-20 pointer-events-none"
      aria-hidden
    >
      {PATHS.map((d, i) => (
        <g key={i}>
          {/* Static line */}
          <path d={d} stroke={LINE_COLORS[i]} strokeWidth="1" fill="none" opacity="0.25" />

          {/* Animated traveling dot */}
          {!prefersReducedMotion && (
            <circle r="4" fill={DOT_COLORS[i]}>
              <animateMotion
                dur={`${1.6 + i * 0.4}s`}
                repeatCount="indefinite"
                path={d}
                begin={`${i * 0.6}s`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${1.6 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.6}s`}
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Agent task card ── */
type TaskStatus = "done" | "running" | "pending";
const STATUS_ICON: Record<TaskStatus, string> = { done: "✓", running: "⟳", pending: "○" };
const STATUS_COLOR: Record<TaskStatus, string> = {
  done: "text-emerald-400/80",
  running: "text-violet-400",
  pending: "text-white/25",
};

function AgentCard({ thread, poolIndex, delay }: { thread: typeof AGENTIC_THREADS[0]; poolIndex: number; delay: number }) {
  const tasks = thread.tasks[poolIndex];
  const color = thread.id === "code" ? "border-violet-500/20" : thread.id === "research" ? "border-cyan-500/20" : "border-violet-400/20";
  const dot = thread.id === "code" ? "bg-violet-500" : thread.id === "research" ? "bg-cyan-500" : "bg-violet-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
      className={`bg-[rgba(10,10,18,0.8)] border ${color} rounded-xl p-4 md:p-5 backdrop-blur-sm hover:border-accent/40 transition-colors duration-300`}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
        <span className={`h-1.5 w-1.5 rounded-full ${dot} pulse-glow`} />
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
          {thread.label}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-1.5">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
            <span className={`${STATUS_COLOR[task.status]} w-3 text-center flex-shrink-0`}>
              {STATUS_ICON[task.status]}
            </span>
            <span className={task.status === "done" ? "text-white/40" : task.status === "running" ? "text-white/85" : "text-white/20"}>
              {task.label}
              {task.status === "done" && task.duration && (
                <span className="text-white/25 ml-1">· {task.duration}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Section ── */
export function Future() {
  const t = useTranslations("sections.future");
  const cta = useTranslations("common.cta");
  const [pool, setPool] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPool((p) => (p + 1) % AGENTIC_THREADS[0].tasks.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="future"
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header text */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Reveal direction="up">
            <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/40 mb-8">
              {t("eyebrow")}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.15} duration={1}>
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground mb-8">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-xl text-muted leading-relaxed">
              {t("body")}
            </p>
          </Reveal>
        </div>

        {/* ── Visual: brain → lines → cards ── */}
        <Reveal direction="up" delay={0.4}>
          <div className="relative">
            {/* Brain — desktop */}
            <div className="hidden md:block relative h-[320px] mx-auto max-w-sm mb-0">
              <LazyBrainAgentic />
              {/* Glow underneath brain */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, transparent 70%)", filter: "blur(12px)" }}
                aria-hidden
              />
            </div>

            {/* SVG connector lines — desktop only */}
            <div className="hidden md:block -mt-2">
              <ConnectorLines />
            </div>

            {/* 3 agent cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {AGENTIC_THREADS.map((thread, i) => (
                <AgentCard key={thread.id} thread={thread} poolIndex={pool} delay={0.1 * i} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal direction="up" delay={0.5}>
          <div className="text-center mt-16">
            <Link
              href="/#call"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent/50 text-foreground hover:bg-accent hover:border-accent transition-all hover:gap-3 shadow-glow"
            >
              {cta("earlyAccess")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
