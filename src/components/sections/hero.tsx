import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("sections.hero");
  const cta = useTranslations("common.cta");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" aria-hidden />
      <div className="noise" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-24 w-full">
        <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-8">
          {t("eyebrow")}
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground whitespace-pre-line">
          {t("headline")}
        </h1>

        <p className="mt-10 max-w-2xl text-lg text-muted leading-relaxed">
          {t("sub")}
        </p>

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
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-xs font-mono uppercase tracking-widest animate-pulse"
        aria-hidden
      >
        ↓ scroll
      </div>
    </section>
  );
}
