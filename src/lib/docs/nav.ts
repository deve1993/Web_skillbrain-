import type { Locale } from "@/i18n/routing";

export type NavItem = {
  slug: string;
  title: string;
  children?: { anchor: string; title: string }[];
};

export const SLUGS = [
  "getting-started",
  "installation",
  "tool-reference",
  "ide-setup",
  "skills-memory",
  "configuration",
] as const;

export type DocSlug = (typeof SLUGS)[number];

export const docsNav: Record<Locale, NavItem[]> = {
  it: [
    { slug: "getting-started", title: "Per iniziare" },
    { slug: "installation", title: "Installazione" },
    { slug: "tool-reference", title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "IDE Setup",
      children: [
        { anchor: "claude-code", title: "Claude Code" },
        { anchor: "cursor", title: "Cursor" },
        { anchor: "cline", title: "Cline" },
        { anchor: "windsurf", title: "Windsurf" },
      ],
    },
    { slug: "skills-memory", title: "Skills & Memory" },
    { slug: "configuration", title: "Configurazione" },
  ],
  en: [
    { slug: "getting-started", title: "Getting Started" },
    { slug: "installation", title: "Installation" },
    { slug: "tool-reference", title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "IDE Setup",
      children: [
        { anchor: "claude-code", title: "Claude Code" },
        { anchor: "cursor", title: "Cursor" },
        { anchor: "cline", title: "Cline" },
        { anchor: "windsurf", title: "Windsurf" },
      ],
    },
    { slug: "skills-memory", title: "Skills & Memory" },
    { slug: "configuration", title: "Configuration" },
  ],
  cs: [
    { slug: "getting-started", title: "Začínáme" },
    { slug: "installation", title: "Instalace" },
    { slug: "tool-reference", title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "Nastavení IDE",
      children: [
        { anchor: "claude-code", title: "Claude Code" },
        { anchor: "cursor", title: "Cursor" },
        { anchor: "cline", title: "Cline" },
        { anchor: "windsurf", title: "Windsurf" },
      ],
    },
    { slug: "skills-memory", title: "Skills & Memory" },
    { slug: "configuration", title: "Konfigurace" },
  ],
};

export function getPrevNext(locale: Locale, currentSlug: string) {
  const nav = docsNav[locale];
  const index = nav.findIndex((item) => item.slug === currentSlug);
  return {
    prev: index > 0 ? nav[index - 1] : null,
    next: index < nav.length - 1 ? nav[index + 1] : null,
  };
}
