import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { docsNav, getPrevNext, SLUGS } from "@/lib/docs/nav";
import { docsMdxComponents } from "@/components/docs/mdx-components";
import { DocsToc } from "@/components/docs/toc";
import type { TocItem } from "@/components/docs/toc";
import { DocsPrevNext } from "@/components/docs/prev-next";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !SLUGS.includes(slug as never)) {
    return {};
  }
  const { metadata: docMeta } = await import(
    `@/content/docs/${locale}/${slug}.mdx`
  ) as { metadata: { title: string; description: string } };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skillbrain.fl1.it";

  return {
    title: docMeta.title,
    description: docMeta.description,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/docs/${slug}`])
      ),
    },
    openGraph: {
      title: `${docMeta.title} | SkillBrain Docs`,
      description: docMeta.description,
      url: `${siteUrl}/${locale}/docs/${slug}`,
    },
  };
}

export default async function DocsPage({ params }: { params: Params }) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale) || !SLUGS.includes(slug as never)) {
    notFound();
  }

  const { default: Content, toc } = await import(
    `@/content/docs/${locale}/${slug}.mdx`
  ) as { default: React.ComponentType<{ components: typeof docsMdxComponents }>; toc: TocItem[] };

  const { prev, next } = getPrevNext(locale as Locale, slug);
  const navItems = docsNav[locale as Locale];
  const currentItem = navItems.find((item) => item.slug === slug);

  const tocLabel =
    locale === "it" ? "In questa pagina" :
    locale === "cs" ? "Na této stránce" :
    "On this page";

  return (
    <>
      {/* Main content */}
      <article className="flex-1 min-w-0 py-10 px-6 lg:px-10 max-w-3xl">
        {/* Breadcrumb */}
        <p className="text-[10px] text-subtle font-mono uppercase tracking-widest mb-3">
          docs / {currentItem?.title ?? slug}
        </p>

        <Content components={docsMdxComponents} />

        <DocsPrevNext prev={prev} next={next} locale={locale} />
      </article>

      {/* TOC */}
      <aside className="hidden lg:block w-44 shrink-0 sticky top-24 self-start h-[calc(100vh-6rem)] overflow-y-auto py-10 pl-4 border-l border-white/[0.06]">
        <DocsToc items={toc} label={tocLabel} />
      </aside>
    </>
  );
}
