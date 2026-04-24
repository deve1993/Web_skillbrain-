import { useTranslations } from "next-intl";

const pillarKeys = ["memory", "skills", "multiuser"] as const;

export function Pillars() {
  const t = useTranslations("sections.pillars");

  return (
    <section id="pillars" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mb-20">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden">
          {pillarKeys.map((key, i) => (
            <article
              key={key}
              className="relative group bg-surface p-8 md:p-10 min-h-[420px] flex flex-col justify-end overflow-hidden"
            >
              {/* Video placeholder — Sprint 2/3 injects actual <video> */}
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                aria-hidden
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    i === 0
                      ? "from-accent/20 via-transparent to-transparent"
                      : i === 1
                        ? "from-cyan/20 via-transparent to-transparent"
                        : "from-accent-soft/20 via-transparent to-transparent"
                  }`}
                />
              </div>

              <div className="absolute top-8 left-8 font-mono text-xs text-subtle">
                0{i + 1}
              </div>

              <div className="relative">
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-muted leading-relaxed">
                  {t(`${key}.body`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
