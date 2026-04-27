"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { LazyBrainAgentic } from "@/components/three/lazy-brain-agentic";
import { AgentThreads } from "@/components/three/agentic-threads";

export function Future() {
  const t = useTranslations("sections.future");
  const cta = useTranslations("common.cta");

  return (
    <section
      id="future"
      className="relative py-32 md:py-40 border-t border-white/[0.06] overflow-hidden bg-[#050509]"
    >
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow */}
        <Reveal direction="up">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/40 mb-10">
            {t("eyebrow")}
          </p>
        </Reveal>

        {/* Headline */}
        <Reveal direction="up" delay={0.15} duration={1}>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground mb-8">
            {t("title")}
          </h2>
        </Reveal>

        {/* Body */}
        <Reveal direction="up" delay={0.3}>
          <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-16">
            {t("body")}
          </p>
        </Reveal>

        {/* Visual block: brain top + threads below */}
        <Reveal direction="up" delay={0.45}>
          <div className="relative w-full">
            {/* Brain scene — desktop */}
            <div className="hidden md:block">
              {/* Brain canvas */}
              <div className="relative h-[220px] mb-8 mx-auto max-w-[280px]">
                <LazyBrainAgentic />
              </div>

              {/* 3 thread columns */}
              <AgentThreads />
            </div>

            {/* Mobile fallback: threads only, no brain */}
            <div className="block md:hidden">
              <AgentThreads />
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal direction="up" delay={0.6}>
          <Link
            href="/#call"
            className="mt-16 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent/50 text-foreground hover:bg-accent hover:border-accent transition-all hover:gap-3 shadow-glow"
          >
            {cta("earlyAccess")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
