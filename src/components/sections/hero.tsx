import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";

export function Hero() {
  const t = useTranslations("sections.hero");
  const cta = useTranslations("common.cta");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg-animated opacity-70" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      {/* Status badge — discreet "live" indicator */}
      <Reveal direction="down" delay={0.1} className="absolute top-24 left-6 right-6 mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-surface/40 backdrop-blur-sm text-xs font-mono uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" aria-hidden />
          v1 · open source · MIT
        </div>
      </Reveal>

      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-24 w-full">
        <Reveal direction="up" delay={0.15}>
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-8">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Parallax speed={0.08}>
          <Reveal direction="up" delay={0.25} duration={0.9}>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground whitespace-pre-line">
              {t("headline")}
            </h1>
          </Reveal>
        </Parallax>

        <Reveal direction="up" delay={0.5}>
          <p className="mt-10 max-w-2xl text-lg text-muted leading-relaxed">
            {t("sub")}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.7}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/#pillars"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:gap-3"
            >
              {cta("primary")}
            </Link>
            <a
              href="https://github.com/deve1993/skillbrain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-accent text-muted hover:text-foreground transition-colors text-sm"
            >
              {cta("github")}
            </a>
          </div>
        </Reveal>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-xs font-mono uppercase tracking-widest"
        aria-hidden
      >
        <span className="float-slow inline-block">↓ scroll</span>
      </div>
    </section>
  );
}
