import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { TeamWindows } from "@/components/motion/team-windows";

export function Team() {
  const t = useTranslations("sections.team");

  return (
    <section
      id="team"
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <Reveal direction="up">
            <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
              {t("eyebrow")}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="font-display text-5xl sm:text-6xl text-foreground">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-8 text-lg text-muted leading-relaxed">{t("body")}</p>
          </Reveal>
        </div>

        <div className="md:col-span-3">
          <TeamWindows />
        </div>
      </div>
    </section>
  );
}
