import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("sections.footer");

  return (
    <footer className="relative border-t border-border/40 mt-12">
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
            aria-label="SkillBrain — home"
          >
            <Logo />
          </Link>
          <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <nav aria-label="Footer links" className="space-y-3 text-sm">
          <a
            href="https://github.com/deve1993/skillbrain"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted hover:text-foreground transition-colors"
          >
            {t("links.github")} ↗
          </a>
          <a
            href="https://github.com/deve1993/skillbrain#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted hover:text-foreground transition-colors"
          >
            {t("links.docs")} ↗
          </a>
          <a
            href="mailto:daniel@pixarts.eu"
            className="block text-muted hover:text-foreground transition-colors"
          >
            {t("links.email")}
          </a>
        </nav>

        <nav aria-label="Legal" className="space-y-3 text-sm">
          <Link
            href="/legal/privacy"
            className="block text-muted hover:text-foreground transition-colors"
          >
            {t("links.privacy")}
          </Link>
          <Link
            href="/legal/cookies"
            className="block text-muted hover:text-foreground transition-colors"
          >
            {t("links.cookies")}
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-subtle uppercase tracking-wider">
          <span>
            © {new Date().getFullYear()} Pixarts S.r.l. · {t("license")}
          </span>
          <span className="flex items-center gap-2">
            {t("madeIn")} <span aria-hidden>🇮🇹</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
