import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/sections/footer";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.cookies" });
  return { title: `${t("title")} — SkillBrain`, robots: { index: false } };
}

export default async function CookiesPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.cookies" });

  return (
    <>
      <Nav />
      <main className="pt-32 pb-32 mx-auto max-w-3xl px-6 prose-invert">
        <p className="font-mono text-xs uppercase tracking-widest text-subtle mb-4">
          {t("lastUpdated")}: 2026-04-24
        </p>
        <h1 className="font-display text-5xl md:text-6xl mb-8">{t("title")}</h1>
        <p className="text-lg text-muted leading-relaxed">{t("intro")}</p>
      </main>
      <Footer />
    </>
  );
}
