import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SLUGS } from "@/lib/docs/nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skillbrain.fl1.it";

const pages = [
  { route: "",               changeFrequency: "weekly"  as const, priority: 1.0 },
  { route: "/legal/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
  { route: "/legal/cookies", changeFrequency: "monthly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const mainPages = pages.flatMap(({ route, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${route}`]),
        ),
      },
    })),
  );

  const docPages = SLUGS.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/docs/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/docs/${slug}`]),
        ),
      },
    })),
  );

  return [...mainPages, ...docPages];
}
