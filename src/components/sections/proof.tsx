import { useTranslations } from "next-intl";
import { getStats } from "@/lib/stats";

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export async function Proof() {
  const t = await import("next-intl/server").then((m) =>
    m.getTranslations("sections.proof"),
  );
  const stats = await getStats();

  return (
    <ProofView
      t={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        memories: t("stats.memories"),
        skills: t("stats.skills"),
        sessions: t("stats.sessions"),
        caseStudy: t("caseStudy"),
        trustedBy: t("trustedBy"),
      }}
      stats={stats}
    />
  );
}

function ProofView({
  t,
  stats,
}: {
  t: {
    eyebrow: string;
    title: string;
    memories: string;
    skills: string;
    sessions: string;
    caseStudy: string;
    trustedBy: string;
  };
  stats: Awaited<ReturnType<typeof getStats>>;
}) {
  return (
    <section
      id="proof"
      className="relative py-32 md:py-40 border-t border-border/40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden mb-16">
          {[
            { label: t.memories, value: stats.memories },
            { label: t.skills, value: stats.skills },
            { label: t.sessions, value: stats.sessions },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface p-10 flex flex-col gap-4"
            >
              <div className="font-mono text-7xl text-foreground tabular-nums">
                {formatNumber(stat.value)}
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <blockquote className="max-w-3xl font-serif text-2xl italic text-muted leading-relaxed border-l-2 border-accent pl-6">
          {t.caseStudy}
        </blockquote>

        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-wider text-subtle mb-6">
            {t.trustedBy}
          </p>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-muted">
            {["Pixarts", "Singleflo", "DVEsolutions", "Osservatorio Fiscale"].map(
              (logo) => (
                <span key={logo} className="font-serif text-xl opacity-70">
                  {logo}
                </span>
              ),
            )}
            <a
              href="https://github.com/deve1993/skillbrain"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto font-mono text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              ⭐ {stats.githubStars} on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
