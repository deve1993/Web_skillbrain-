import { useTranslations } from "next-intl";

const cities = ["Milano", "Praha", "Berlin", "Lisboa"] as const;

export function Team() {
  const t = useTranslations("sections.team");

  return (
    <section
      id="team"
      className="relative py-32 md:py-40 border-t border-border/40"
    >
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-8 text-lg text-muted leading-relaxed">{t("body")}</p>
        </div>

        {/* Split-screen placeholder — Sprint 3 injects Veo 3 b-roll */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3">
          {cities.map((city, i) => (
            <div
              key={city}
              className="relative aspect-video rounded-xl border border-border/60 bg-surface overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  i % 2 === 0
                    ? "from-accent/15 to-transparent"
                    : "from-cyan/15 to-transparent"
                }`}
                aria-hidden
              />
              <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                {city}
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-subtle">
                ● live
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-border/60 group-hover:border-accent transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
