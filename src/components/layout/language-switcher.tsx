"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const t = useTranslations("common.languageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as (typeof routing.locales)[number];
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <label className="sr-only sm:not-sr-only sm:inline-flex items-center gap-2 text-xs text-muted">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={onChange}
        disabled={isPending}
        className="bg-transparent border border-border rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider hover:border-accent transition-colors cursor-pointer"
        aria-label={t("label")}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-surface text-foreground">
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
