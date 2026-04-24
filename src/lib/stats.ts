export type SkillBrainStats = {
  memories: number;
  skills: number;
  sessions: number;
  githubStars: number;
};

const DEFAULT_STATS: SkillBrainStats = {
  memories: 103,
  skills: 253,
  sessions: 847,
  githubStars: 3,
};

export async function getStats(): Promise<SkillBrainStats> {
  try {
    const [statsRes, ghRes] = await Promise.allSettled([
      process.env.SKILLBRAIN_API_URL
        ? fetch(`${process.env.SKILLBRAIN_API_URL}/stats`, {
            next: { revalidate: 3600 },
            headers: process.env.SKILLBRAIN_API_KEY
              ? { Authorization: `Bearer ${process.env.SKILLBRAIN_API_KEY}` }
              : {},
          })
        : Promise.reject(new Error("no api url")),
      fetch("https://api.github.com/repos/deve1993/skillbrain", {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    const stats: SkillBrainStats = { ...DEFAULT_STATS };

    if (statsRes.status === "fulfilled" && statsRes.value.ok) {
      const data = (await statsRes.value.json()) as Partial<SkillBrainStats>;
      if (typeof data.memories === "number") stats.memories = data.memories;
      if (typeof data.skills === "number") stats.skills = data.skills;
      if (typeof data.sessions === "number") stats.sessions = data.sessions;
    }

    if (ghRes.status === "fulfilled" && ghRes.value.ok) {
      const data = (await ghRes.value.json()) as { stargazers_count?: number };
      if (typeof data.stargazers_count === "number") {
        stats.githubStars = data.stargazers_count;
      }
    }

    return stats;
  } catch {
    return DEFAULT_STATS;
  }
}
