import { useTranslations } from "next-intl";

export function Flow() {
  const t = useTranslations("sections.flow");

  return (
    <section
      id="flow"
      className="relative py-32 md:py-40 border-t border-border/40"
    >
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
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

        {/* Scroll-jack placeholder — Sprint 3 injects Remotion scroll-driven video */}
        <div className="relative aspect-[4/5] rounded-2xl border border-border/60 bg-surface overflow-hidden">
          <div className="absolute inset-0 flex flex-col divide-y divide-border/40">
            {[
              "1 · Prompt",
              "2 · Recall memory",
              "3 · Load skill",
              "4 · Execute",
              "5 · Save new memory",
            ].map((step, i) => (
              <div
                key={step}
                className="flex-1 flex items-center justify-between px-6 group hover:bg-surface-elevated transition-colors"
              >
                <span className="font-mono text-sm text-muted group-hover:text-foreground transition-colors">
                  {step}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow"
                  style={{ opacity: 0.3 + i * 0.15 }}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
