"use client";

import { CountUp } from "@/components/motion/count-up";
import type { SkillBrainStats } from "@/lib/stats";

type Labels = {
  eyebrow: string;
  title: string;
  memories: string;
  skills: string;
  sessions: string;
  caseStudy: string;
  trustedBy: string;
};

export function ProofView({
  t,
  stats,
}: {
  t: Labels;
  stats: SkillBrainStats;
}) {
  return (
    <section
      id="proof"
      className="relative py-24 md:py-32 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t.title}
          </h2>
        </div>

        {/* Stat cards — hairline dividers, no backgrounds */}
        <div className="grid md:grid-cols-3 divide-x divide-white/[0.06] mb-16">
          {[
            { label: t.memories, value: stats.memories },
            { label: t.skills, value: stats.skills },
            { label: t.sessions, value: stats.sessions },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative bg-transparent p-8 flex flex-col gap-4"
            >
              <div className="font-mono text-7xl text-foreground tabular-nums">
                <CountUp end={stat.value} />
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quote — sans, no border-left */}
        <blockquote className="max-w-3xl font-sans text-xl text-foreground leading-relaxed">
          {t.caseStudy}
        </blockquote>
        <p className="mt-4 font-mono text-sm uppercase tracking-wider text-subtle">
          — Daniel De Vecchi · Founder
        </p>

        {/* Trusted by */}
        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-wider text-subtle mb-6">
            {t.trustedBy}
          </p>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {["Pixarts", "Singleflo", "DVEsolutions", "Persevida", "Quickfy"].map(
              (logo) => (
                <span
                  key={logo}
                  className="font-mono uppercase text-sm tracking-[0.2em] text-white/30 hover:text-white/80 transition-colors cursor-default"
                >
                  {logo}
                </span>
              ),
            )}
            <a
              href="https://github.com/deve1993/skillbrain"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto font-mono text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              ⭐ {stats.githubStars} on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
