import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function Nav() {
  const t = useTranslations("common");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          SkillBrain
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="/#pillars" className="hover:text-foreground transition-colors">
            {t("nav.pillars")}
          </Link>
          <Link href="/#flow" className="hover:text-foreground transition-colors">
            {t("nav.flow")}
          </Link>
          <Link href="/#future" className="hover:text-foreground transition-colors">
            {t("nav.future")}
          </Link>
          <Link href="/#opensource" className="hover:text-foreground transition-colors">
            {t("nav.opensource")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/#call"
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-border hover:border-accent hover:text-foreground transition-colors"
          >
            {t("nav.call")}
          </Link>
        </div>
      </div>
    </header>
  );
}
