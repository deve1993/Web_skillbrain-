import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { AgentConstellation } from "@/components/motion/agent-constellation";

export function Future() {
  const t = useTranslations("sections.future");
  const cta = useTranslations("common.cta");

  return (
    <section
      id="future"
      className="relative py-40 md:py-56 border-t border-border/40 overflow-hidden bg-[#04040A]"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-[#04040A] to-background"
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl float-slow"
        aria-hidden
      />

      <AgentConstellation />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal direction="up">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-muted mb-10">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15} duration={1}>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground">
            {t("title")}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.4}>
          <p className="mt-12 text-xl text-muted font-serif italic leading-relaxed max-w-2xl mx-auto">
            {t("body")}
          </p>
        </Reveal>

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
