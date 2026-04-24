import { useTranslations } from "next-intl";

export function Shift() {
  const t = useTranslations("sections.shift");

  return (
    <section
      id="shift"
      className="relative min-h-[80vh] flex items-center overflow-hidden border-y border-border/40"
    >
      {/* Lens flare placeholder — Sprint 2 replaces with Veo 3 video */}
      <div
        className="absolute inset-y-0 -left-1/4 w-3/4 bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 py-32 w-full text-center">
        <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-8">
          {t("eyebrow")}
        </p>

        <h2 className="font-display text-7xl sm:text-8xl md:text-9xl text-foreground">
          {t("headline")}
        </h2>

        <p className="mt-10 text-xl sm:text-2xl text-muted font-serif italic">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}
