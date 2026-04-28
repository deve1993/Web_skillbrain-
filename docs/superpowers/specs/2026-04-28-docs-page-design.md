# Docs Page — Design Spec

**Data:** 2026-04-28
**Progetto:** Web_SkillBrain
**Stato:** Approvato

---

## Obiettivo

Creare una sezione `/docs` che documenta il MCP server SkillBrain: installazione, tool disponibili, configurazione per IDE (Claude Code, Cursor, Cline, Windsurf). La pagina deve essere multilingua (it/en/cs), usare file MDX per i contenuti, e rispettare lo stile visivo del sito esistente.

---

## Decisioni chiave

| Decisione | Scelta | Motivazione |
|-----------|--------|-------------|
| Lingua | it/en/cs (multilingua) | Coerente con il resto del sito |
| Contenuto | File MDX | Aggiornabili senza toccare il codice |
| Layout | Sidebar sinistra + contenuto + TOC destra | Massima navigabilità, stile Next.js/Stripe docs |
| MDX engine | `@next/mdx` nativo | Zero dipendenze extra, stabile |
| Sidebar config | Manuale in `nav.ts` | Controllo esplicito su ordine e titoli per lingua |

---

## Sezioni docs (6)

1. **Getting Started** — panoramica, prerequisiti, quickstart
2. **Installation** — npm/npx, configurazione base
3. **Tool Reference** — lista completa dei tool MCP con signature e esempi
4. **IDE Setup** — sotto-pagine per Claude Code, Cursor, Cline, Windsurf
5. **Skills & Memory** — come usare skill_read, memory_add, session_start
6. **Configuration** — variabili d'ambiente, settings, opzioni avanzate

---

## Architettura file

```
content/docs/
  it/
    getting-started.mdx
    installation.mdx
    tool-reference.mdx
    ide-setup.mdx
    skills-memory.mdx
    configuration.mdx
  en/
    (stesse 6 pagine)
  cs/
    (stesse 6 pagine)

src/app/[locale]/docs/
  layout.tsx          ← shell sidebar + TOC, eredita layout locale esistente
  page.tsx            ← redirect a /[locale]/docs/getting-started
  [slug]/
    page.tsx          ← legge MDX da content/docs/[locale]/[slug].mdx

src/lib/docs/
  nav.ts              ← NavItem[] per locale: { slug, title }
  mdx.ts              ← legge file MDX con fs.readFile + compileMDX di @next/mdx

src/components/docs/
  sidebar.tsx         ← sidebar navigazione con voce attiva e sotto-voci IDE Setup
  toc.tsx             ← indice "In questa pagina" con scroll spy
  mdx-components.tsx  ← override componenti MDX (h1, h2, code, pre, callout)
  prev-next.tsx       ← navigazione prev/next in fondo al contenuto
```

---

## Routing

- `/[locale]/docs` → redirect a `/[locale]/docs/getting-started`
- `/[locale]/docs/[slug]` → carica `content/docs/[locale]/[slug].mdx`
- `generateStaticParams` genera tutte le combinazioni locale × slug a build time
- Se slug o locale non trovati → `notFound()`

---

## Layout (tre colonne)

```
┌─────────────────────────────────────────────────────┐
│  Nav del sito (eredita da layout.tsx esistente)     │
├──────────┬──────────────────────────────┬───────────┤
│          │                              │           │
│ Sidebar  │   Contenuto MDX              │   TOC     │
│ 224px    │   (flex:1, max-w-prose)      │  164px    │
│          │                              │           │
│ sticky   │   breadcrumb                 │  sticky   │
│ top-16   │   h1 + meta                  │  top-16   │
│          │   prose content              │           │
│          │   prev/next                  │           │
└──────────┴──────────────────────────────┴───────────┘
```

- Sidebar e TOC: `sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`
- Mobile: sidebar collassata in drawer, TOC nascosta
- Tablet (md): sidebar visibile, TOC nascosta

---

## Design tokens (dal sito)

| Elemento | Classe / Valore |
|----------|----------------|
| Background | `bg-background` (#050509) |
| Superficie card/code | `bg-surface` (#0d0d14) |
| Voce sidebar attiva bg | `bg-surface-elevated` (#141420) |
| Voce sidebar attiva testo | `text-accent-soft` (#9f7aea) |
| Bordo voce attiva | `border-accent/20` |
| TOC heading attivo | `text-accent-soft` + `border-l-2 border-accent` |
| Bordi | `border-white/[0.06]` |
| Testo corpo | `text-muted` (#a8a8b3) |
| Headings | `text-foreground` (#f5f5f7) |
| Testo secondario | `text-subtle` (#6b6b7a) |
| Code inline | `bg-surface font-mono text-cyan` |
| Code block | `bg-surface border border-white/[0.06] rounded-lg` |
| Callout box | `border-l-2 border-accent/50 bg-surface` |
| Prev/Next button | `bg-surface border border-white/[0.06] hover:border-accent` |
| Font | `font-sans` (Geist), `font-mono` (Geist Mono) |
| Dot grid | Ereditato da `layout.tsx` — nessun extra |

---

## Componente `nav.ts`

```typescript
export type NavItem = {
  slug: string;
  title: string;
  children?: NavItem[]; // per IDE Setup
};

export const docsNav: Record<Locale, NavItem[]> = {
  it: [
    { slug: "getting-started", title: "Per iniziare" },
    { slug: "installation",    title: "Installazione" },
    { slug: "tool-reference",  title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "IDE Setup",
      // children = anchor links nella stessa pagina ide-setup.mdx (un h2 per IDE)
      // href generato: /[locale]/docs/ide-setup#claude-code
      children: [
        { slug: "ide-setup#claude-code", title: "Claude Code" },
        { slug: "ide-setup#cursor",      title: "Cursor" },
        { slug: "ide-setup#cline",       title: "Cline" },
        { slug: "ide-setup#windsurf",    title: "Windsurf" },
      ],
    },
    { slug: "skills-memory",  title: "Skills & Memory" },
    { slug: "configuration",  title: "Configurazione" },
  ],
  en: [
    { slug: "getting-started", title: "Getting Started" },
    { slug: "installation",    title: "Installation" },
    { slug: "tool-reference",  title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "IDE Setup",
      children: [
        { slug: "ide-setup#claude-code", title: "Claude Code" },
        { slug: "ide-setup#cursor",      title: "Cursor" },
        { slug: "ide-setup#cline",       title: "Cline" },
        { slug: "ide-setup#windsurf",    title: "Windsurf" },
      ],
    },
    { slug: "skills-memory",  title: "Skills & Memory" },
    { slug: "configuration",  title: "Configuration" },
  ],
  cs: [
    { slug: "getting-started", title: "Začínáme" },
    { slug: "installation",    title: "Instalace" },
    { slug: "tool-reference",  title: "Tool Reference" },
    {
      slug: "ide-setup",
      title: "Nastavení IDE",
      children: [
        { slug: "ide-setup#claude-code", title: "Claude Code" },
        { slug: "ide-setup#cursor",      title: "Cursor" },
        { slug: "ide-setup#cline",       title: "Cline" },
        { slug: "ide-setup#windsurf",    title: "Windsurf" },
      ],
    },
    { slug: "skills-memory",  title: "Skills & Memory" },
    { slug: "configuration",  title: "Konfigurace" },
  ],
};
```

---

## Caricamento MDX nel `[slug]/page.tsx`

Con `@next/mdx` configurato in `next.config.ts`, il contenuto viene caricato tramite dynamic import — webpack risolve staticamente tutti i file a build time (safe perché `generateStaticParams` enumera tutti gli slug possibili):

```typescript
// src/app/[locale]/docs/[slug]/page.tsx
const { default: Content } = await import(
  `../../../../../content/docs/${locale}/${slug}.mdx`
);
return <Content components={mdxComponents} />;
```

`mdxComponents` (definito in `src/components/docs/mdx-components.tsx`) fa l'override di `h1`, `h2`, `h3`, `pre`, `code`, aggiungendo anchor ID agli heading per il TOC e stile coerente con il design system.

---

## Scroll spy TOC

Il TOC usa un `IntersectionObserver` leggero (client component) che osserva tutti gli `h2` e `h3` del contenuto. Quando un heading entra nel viewport, il link corrispondente nel TOC si evidenzia con `text-accent-soft` e `border-l-2 border-accent`.

---

## SEO

Ogni pagina docs genera `generateMetadata` con:
- `title`: `${pageTitle} | SkillBrain Docs`  (sfrutta il `template: "%s | SkillBrain"` già configurato)
- `description`: prima frase del file MDX (estratta con regex)
- `alternates.languages`: tutte e 3 le lingue per la stessa slug

---

## Dipendenze

| Pacchetto | Motivo | Già presente |
|-----------|--------|-------------|
| `@next/mdx` | Compilazione MDX | No — da installare |
| `@mdx-js/react` | Provider componenti | No — da installare |
| Tutto il resto | — | Sì |

---

## Out of scope

- Search full-text nella docs
- Versioning della documentazione
- Commenti / feedback per pagina
- Generazione automatica della sidebar da frontmatter (si usa `nav.ts` manuale)
