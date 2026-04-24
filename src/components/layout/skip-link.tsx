import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-foreground focus:text-background focus:font-medium focus:text-sm"
    >
      {t("skipToContent")}
    </a>
  );
}
