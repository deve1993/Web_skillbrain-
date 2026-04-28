import { getStats } from "@/lib/stats";
import { ProofView } from "./proof-client";

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
