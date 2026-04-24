import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { KnowledgeGraph } from "@/components/motion/knowledge-graph";
import { SkillsCloud } from "@/components/motion/skills-cloud";
import { MultiUserSync } from "@/components/motion/multiuser-sync";
import { getStats } from "@/lib/stats";

export async function Pillars() {
  const t = await import("next-intl/server").then((m) =>
    m.getTranslations("sections.pillars"),
  );
  const stats = await getStats();

  return (
    <section id="pillars" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal direction="up">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground max-w-3xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden">
          <PillarCard
            index={0}
            title={t("memory.title")}
            body={t("memory.body")}
            stat={`${stats.memories} active`}
            visual={
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <KnowledgeGraph />
              </div>
            }
            tone="accent"
          />
          <PillarCard
            index={1}
            title={t("skills.title")}
            body={t("skills.body")}
            stat={`${stats.skills} curated`}
            visual={
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <SkillsCloud count={stats.skills} />
              </div>
            }
            tone="cyan"
          />
          <PillarCard
            index={2}
            title={t("multiuser.title")}
            body={t("multiuser.body")}
            stat="real-time sync"
            visual={
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <MultiUserSync />
              </div>
            }
            tone="accent-soft"
          />
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  index,
  title,
  body,
  stat,
  visual,
  tone,
}: {
  index: number;
  title: string;
  body: string;
  stat: string;
  visual: React.ReactNode;
  tone: "accent" | "cyan" | "accent-soft";
}) {
  const toneClass =
    tone === "accent"
      ? "from-accent/15"
      : tone === "cyan"
        ? "from-cyan/15"
        : "from-accent-soft/15";

  return (
    <Reveal direction="up" delay={0.1 * index} as="article">
      <div className="relative group bg-surface min-h-[480px] flex flex-col overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${toneClass} via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700`}
          aria-hidden
        />

        <div className="relative h-64 border-b border-border/40 overflow-hidden">
          {visual}
        </div>

        <div className="relative p-8 md:p-10 flex-1 flex flex-col">
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-mono text-xs text-subtle uppercase tracking-wider">
              0{index + 1}
            </span>
            <span className="font-mono text-xs text-muted tabular-nums">
              {stat}
            </span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {title}
          </h3>
          <p className="text-muted leading-relaxed">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}
