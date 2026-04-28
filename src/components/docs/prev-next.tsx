import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/lib/docs/nav";

type Props = {
  prev: NavItem | null;
  next: NavItem | null;
  locale: string;
};

export function DocsPrevNext({ prev, next, locale }: Props) {
  if (!prev && !next) return null;

  return (
    <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/[0.06]">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}` as never}
          locale={locale as never}
          className="group flex items-center gap-2 px-4 py-2 bg-surface border border-white/[0.06] hover:border-accent rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          <span className="text-accent-soft group-hover:-translate-x-0.5 transition-transform">←</span>
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}` as never}
          locale={locale as never}
          className="group flex items-center gap-2 px-4 py-2 bg-surface border border-white/[0.06] hover:border-accent rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          {next.title}
          <span className="text-accent-soft group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
