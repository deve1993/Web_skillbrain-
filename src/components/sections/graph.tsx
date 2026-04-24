import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { LazyCodebaseGraph } from "@/components/three/lazy-codebase-graph";

export function Graph() {
  const t = useTranslations("sections.graph");

  return (
    <section
      id="graph"
      className="relative py-32 md:py-40 border-t border-border/40 overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg-animated opacity-25" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Reveal direction="up">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal direction="up" delay={0.15}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground max-w-4xl mx-auto">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.3}>
          <p className="mt-8 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            {t("body")}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.4}>
          <div className="mt-16 relative aspect-video rounded-3xl border border-border/60 bg-surface/40 backdrop-blur-sm overflow-hidden">
            {/* SSR-safe SVG fallback (visible until R3F mounts) */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden
            >
              <svg
                viewBox="0 0 800 450"
                className="w-2/3 h-2/3 opacity-30"
              >
                <defs>
                  <radialGradient id="graph-fallback" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="400" cy="225" r="80" fill="url(#graph-fallback)" />
                <circle cx="400" cy="225" r="14" fill="var(--color-accent)" />
              </svg>
            </div>

            <LazyCodebaseGraph />

            <div className="absolute bottom-4 left-4 font-mono text-xs text-subtle pointer-events-none">
              codegraph · drag to rotate
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-xs text-subtle pointer-events-none flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" />
              live
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
