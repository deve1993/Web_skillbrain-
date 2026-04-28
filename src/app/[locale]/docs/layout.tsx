import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { DocsSidebar } from "@/components/docs/sidebar";

type Params = Promise<{ locale: string }>;

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full px-4 flex gap-0">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-4 border-r border-white/[0.06]">
          <DocsSidebar locale={locale as Locale} />
        </aside>

        {/* Content area — children includes both main content and TOC */}
        <div className="flex-1 min-w-0 flex">
          {children}
        </div>
      </div>
    </div>
  );
}
