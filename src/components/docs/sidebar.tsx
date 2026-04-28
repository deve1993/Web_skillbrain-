"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { docsNav } from "@/lib/docs/nav";
import type { Locale } from "@/i18n/routing";

type Props = { locale: Locale };

export function DocsSidebar({ locale }: Props) {
  const pathname = usePathname();
  const nav = docsNav[locale];

  return (
    <nav aria-label="Docs navigation">
      <p className="text-[9px] text-subtle uppercase tracking-[0.2em] font-mono mb-3 px-2">
        {locale === "it" ? "Documentazione" : locale === "cs" ? "Dokumentace" : "Documentation"}
      </p>
      <ul className="space-y-0.5">
        {nav.map((item) => {
          const href = `/${locale}/docs/${item.slug}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={item.slug}>
              <Link
                href={`/docs/${item.slug}` as never}
                locale={locale}
                className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-surface-elevated text-accent-soft border border-accent/20"
                    : "text-subtle hover:text-foreground hover:bg-surface"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-soft shrink-0" />
                )}
                {item.slug === "ide-setup" && !isActive && (
                  <span className="h-1.5 w-1.5 shrink-0" />
                )}
                {item.title}
              </Link>

              {item.children && isActive && (
                <ul className="ml-4 mt-0.5 space-y-0.5">
                  {item.children.map((child) => (
                    <li key={child.anchor}>
                      <a
                        href={`#${child.anchor}`}
                        className="block px-2 py-1.5 text-xs text-subtle hover:text-foreground rounded transition-colors"
                      >
                        {child.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
