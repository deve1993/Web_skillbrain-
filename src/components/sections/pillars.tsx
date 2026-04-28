import { Reveal } from "@/components/motion/reveal";
import { VideoBg } from "@/components/motion/video-bg";
import { MemoryFeed } from "@/components/motion/memory-feed";
import { PillarStat } from "@/components/motion/pillar-stat";
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

        <div className="mt-20 grid md:grid-cols-3 gap-6 md:gap-8">
          <PillarCard
            index={0}
            title={t("memory.title")}
            body={t("memory.body")}
            statValue={stats.memories}
            statLabel="active"
            videoSrc="/videos/03-memory.mp4"
            overlay={<MemoryFeed />}
          />
          <PillarCard
            index={1}
            title={t("skills.title")}
            body={t("skills.body")}
            statValue={stats.skills}
            statLabel="curated"
            videoSrc="/videos/04-skills.mp4"
          />
          <PillarCard
            index={2}
            title={t("multiuser.title")}
            body={t("multiuser.body")}
            stat="real-time sync"
            videoSrc="/videos/05-multiuser.mp4"
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
  statValue,
  statLabel,
  videoSrc,
  overlay,
}: {
  index: number;
  title: string;
  body: string;
  stat?: string;
  statValue?: number;
  statLabel?: string;
  videoSrc: string;
  overlay?: React.ReactNode;
}) {
  return (
    <Reveal direction="up" delay={0.1 * index} as="article">
      <div className="group bg-[#0a0a0e] border border-white/[0.06] rounded-2xl min-h-[480px] flex flex-col overflow-hidden hover:border-accent/40 transition-colors duration-300">
        {/* Video area */}
        <div className="relative h-64 border-b border-white/[0.06] overflow-hidden">
          <VideoBg src={videoSrc} opacity={0.75} className="z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" aria-hidden />
          {overlay && (
            <div className="absolute bottom-3 left-3 right-3 z-20">
              {overlay}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative p-10 md:p-12 flex-1 flex flex-col">
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-mono text-xs text-subtle uppercase tracking-wider">
              0{index + 1}
            </span>
            {statValue !== undefined && statLabel ? (
              <PillarStat value={statValue} label={statLabel} />
            ) : (
              <span className="font-mono text-xs text-muted tabular-nums">{stat}</span>
            )}
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
