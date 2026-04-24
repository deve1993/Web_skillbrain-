import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";

export function Shift() {
  const t = useTranslations("sections.shift");

  return (
    <section
      id="shift"
      className="relative min-h-[80vh] flex items-center overflow-hidden border-y border-border/40 bg-[#04040A]"
    >
      <div className="lens-flare" aria-hidden />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl float-slow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 py-32 w-full text-center">
        <Reveal direction="up" delay={0.1}>
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-8">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.3} duration={1}>
          <h2 className="font-display text-7xl sm:text-8xl md:text-9xl text-foreground">
            {t("headline")}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.6}>
          <p className="mt-10 text-xl sm:text-2xl text-muted font-serif italic">
            {t("tagline")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
