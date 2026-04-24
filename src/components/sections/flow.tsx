"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    n: "01",
    label: "Prompt",
    code: '> "add a stripe checkout to the donations page"',
    sub: "Developer asks the AI",
  },
  {
    n: "02",
    label: "Recall memory",
    code: "memory_search → 3 patterns · 1 decision",
    sub: "SkillBrain retrieves prior context",
  },
  {
    n: "03",
    label: "Load skill",
    code: "skill_read('payments') → loaded",
    sub: "The right know-how attaches itself",
  },
  {
    n: "04",
    label: "Execute",
    code: "✓ checkout.tsx · webhook.ts · env updated",
    sub: "AI writes consistent, project-aware code",
  },
  {
    n: "05",
    label: "Save new memory",
    code: "memory_add({ type: 'Pattern', skill: 'payments' })",
    sub: "What was learned, stays — for next time",
  },
];

export function Flow() {
  const t = useTranslations("sections.flow");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="flow"
      ref={containerRef}
      className="relative border-t border-border/40"
      style={{ height: prefersReducedMotion ? "auto" : `${100 + STEPS.length * 60}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
              {t("eyebrow")}
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
              {t("title")}
            </h2>
            <p className="mt-8 text-lg text-muted leading-relaxed max-w-md">
              {t("body")}
            </p>
          </div>

          <div className="relative aspect-[4/5] md:aspect-auto md:h-[70vh] rounded-2xl border border-border bg-surface/80 backdrop-blur-sm overflow-hidden">
            {/* IDE-like chrome */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-soft/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyan/60" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                ~/projects/donations · main
              </span>
              <span className="font-mono text-[10px] text-subtle">●</span>
            </div>

            {/* Steps */}
            <div className="relative h-full">
              {STEPS.map((step, i) => {
                const start = i / STEPS.length;
                const end = (i + 1) / STEPS.length;
                return (
                  <FlowStep
                    key={step.n}
                    step={step}
                    progress={scrollYProgress}
                    range={[start, end]}
                    reduce={!!prefersReducedMotion}
                  />
                );
              })}

              {/* Progress rail */}
              <div className="absolute right-4 top-12 bottom-12 w-0.5 bg-border/60 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-x-0 top-0 bg-accent shadow-glow rounded-full"
                  style={{
                    height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowStep({
  step,
  progress,
  range,
  reduce,
}: {
  step: (typeof STEPS)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  reduce: boolean;
}) {
  const [start, end] = range;
  const opacity = useTransform(
    progress,
    [start - 0.05, start, end, end + 0.05],
    reduce ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [start - 0.05, start, end, end + 0.05],
    reduce ? [0, 0, 0, 0] : [16, 0, 0, -16],
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-6 md:px-10"
      style={{ opacity, y }}
    >
      <div className="font-mono text-xs uppercase tracking-widest text-cyan mb-4">
        Step {step.n} · {step.label}
      </div>
      <div className="font-mono text-sm md:text-base text-foreground bg-background/60 border border-border rounded-lg px-4 py-3 leading-relaxed">
        {step.code}
      </div>
      <div className="mt-6 text-muted text-sm font-serif italic">
        {step.sub}
      </div>
    </motion.div>
  );
}
