import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { AudioToggle } from "./audio-toggle";
import { Logo } from "./logo";

export function Nav() {
  const t = useTranslations("common");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity"
          aria-label="SkillBrain — home"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-sm text-muted"
        >
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

        <div className="flex items-center gap-2">
          <AudioToggle />
          <LanguageSwitcher />
          <Link
            href="/#call"
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-border hover:border-accent hover:text-foreground transition-colors text-muted"
          >
            {t("nav.call")}
          </Link>
        </div>
      </div>
    </header>
  );
}
