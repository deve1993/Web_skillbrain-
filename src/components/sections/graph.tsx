import { useTranslations } from "next-intl";

export function Graph() {
  const t = useTranslations("sections.graph");

  return (
    <section
      id="graph"
      className="relative py-32 md:py-40 border-t border-border/40 overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
          {t("eyebrow")}
        </p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground max-w-4xl mx-auto">
          {t("title")}
        </h2>
        <p className="mt-8 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
          {t("body")}
        </p>

        {/* R3F 3D graph placeholder — Sprint 3 injects react-three-fiber scene */}
        <div className="mt-16 relative aspect-video rounded-3xl border border-border/60 bg-surface/60 backdrop-blur-sm overflow-hidden">
          <svg
            viewBox="0 0 800 450"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[
              { x: 400, y: 225, r: 14 },
              { x: 200, y: 140, r: 9 },
              { x: 600, y: 140, r: 9 },
              { x: 180, y: 310, r: 8 },
              { x: 620, y: 310, r: 8 },
              { x: 340, y: 80, r: 6 },
              { x: 460, y: 80, r: 6 },
              { x: 300, y: 360, r: 6 },
              { x: 500, y: 360, r: 6 },
              { x: 100, y: 225, r: 5 },
              { x: 700, y: 225, r: 5 },
            ].map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={n.r * 2.5} fill="url(#nodeGlow)" />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="var(--color-accent)"
                  opacity="0.85"
                />
              </g>
            ))}
            {[
              [400, 225, 200, 140],
              [400, 225, 600, 140],
              [400, 225, 180, 310],
              [400, 225, 620, 310],
              [200, 140, 340, 80],
              [600, 140, 460, 80],
              [180, 310, 300, 360],
              [620, 310, 500, 360],
              [200, 140, 100, 225],
              [600, 140, 700, 225],
            ].map((l, i) => (
              <line
                key={i}
                x1={l[0]}
                y1={l[1]}
                x2={l[2]}
                y2={l[3]}
                stroke="var(--color-accent)"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
            ))}
          </svg>
          <div className="absolute bottom-4 left-4 font-mono text-xs text-subtle">
            codegraph · demo snapshot
          </div>
        </div>
      </div>
    </section>
  );
}
