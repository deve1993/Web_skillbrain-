import { Reveal } from "@/components/motion/reveal";
import { VideoBg } from "@/components/motion/video-bg";
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
            stat={`${stats.memories} active`}
            videoSrc="/videos/03-memory.mp4"
          />
          <PillarCard
            index={1}
            title={t("skills.title")}
            body={t("skills.body")}
            stat={`${stats.skills} curated`}
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
  videoSrc,
}: {
  index: number;
  title: string;
  body: string;
  stat: string;
  videoSrc: string;
}) {
  return (
    <Reveal direction="up" delay={0.1 * index} as="article">
      <div className="group bg-[#0a0a0e] border border-white/[0.06] rounded-2xl min-h-[480px] flex flex-col overflow-hidden hover:border-white/[0.12] transition-colors duration-200">
        {/* Video area */}
        <div className="relative h-64 border-b border-white/[0.06] overflow-hidden">
          <VideoBg src={videoSrc} opacity={0.75} className="z-0" />
          {/* Subtle overlay vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e]/60 via-transparent to-transparent pointer-events-none z-10" aria-hidden />
        </div>

        {/* Content */}
        <div className="relative p-10 md:p-12 flex-1 flex flex-col">
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
