import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { LazyBrainHero } from "@/components/three/lazy-brain-hero";

export function Hero() {
  const t = useTranslations("sections.hero");
  const cta = useTranslations("common.cta");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="noise z-[1]" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]"
        aria-hidden
      />

      {/* Brain 3D — full right half, no container clipping */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-[2] pointer-events-none">
        <LazyBrainHero />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left column: text + CTAs */}
          <div>
            <Reveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-surface/40 backdrop-blur-sm text-xs font-mono uppercase tracking-wider text-muted mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" aria-hidden />
                v1 · open source · MIT
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="font-mono uppercase tracking-[0.3em] text-xs text-muted mb-6">
                {t("eyebrow")}
              </p>
            </Reveal>

            <Parallax speed={0.06}>
              <Reveal direction="up" delay={0.25} duration={0.9}>
                <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground whitespace-pre-line">
                  {t("headline")}
                </h1>
              </Reveal>
            </Parallax>

            <Reveal direction="up" delay={0.5}>
              <p className="mt-10 max-w-xl text-lg text-muted leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/[0.06] hover:border-accent text-muted hover:text-foreground transition-colors text-sm"
                >
                  {cta("github")}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right column: spacer desktop / terminal fallback mobile */}
          <div>
            {/* Mobile: lightweight terminal fallback */}
            <Reveal direction="up" delay={0.45}>
              <div className="lg:hidden h-[280px] rounded-xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm p-4 overflow-hidden flex flex-col font-mono text-xs">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-2 w-2 rounded-full bg-danger/60" />
                  <span className="h-2 w-2 rounded-full bg-accent-soft/60" />
                  <span className="h-2 w-2 rounded-full bg-cyan/60" />
                </div>
                <p className="text-cyan mb-2">{">"} skillbrain init</p>
                <p className="text-muted">Loading collective memory...</p>
                <p className="text-muted">Connecting to workspace...</p>
                <p className="text-accent-soft mt-2">✓ Ready.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-xs font-mono uppercase tracking-widest z-10"
        aria-hidden
      >
        <span className="float-slow inline-block">↓ scroll</span>
      </div>
    </section>
  );
}
