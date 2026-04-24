# Web_SkillBrain

Cinematic marketing website for [SkillBrain](https://github.com/deve1993/skillbrain) — persistent memory and shared skills for AI coding teams.

Production: **https://skillbrain.fl1.it**

## Stack

- **Next.js 16** (App Router, RSC, Turbopack)
- **Tailwind CSS v4**
- **next-intl** — IT (default) · EN · CS
- **Framer Motion** + **Lenis** — animations & smooth scroll
- **react-hook-form** + **Zod** + **Resend** — contact form
- Multi-stage **Dockerfile** for **Coolify** deploy

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill RESEND_API_KEY at minimum for the form to send
pnpm dev                     # http://localhost:3000 → /it
```

Locale-aware routes: `/it`, `/en`, `/cs`. Legal pages at `/[locale]/legal/{privacy,cookies}`. SEO assets at `/sitemap.xml` and `/robots.txt`.

## Build

```bash
pnpm type-check
pnpm build
pnpm start
```

## Deploy (Coolify)

1. Point Coolify at this repo, branch `main`.
2. Build pack: **Dockerfile** (uses the multi-stage `Dockerfile` at repo root).
3. Set domain `skillbrain.fl1.it` with HTTPS via Let's Encrypt.
4. Add env vars from `.env.example` (Resend key required for the contact form).

## Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # NextIntl provider, fonts, metadata
│   │   ├── page.tsx            # composes the 11 sections
│   │   ├── opengraph-image.tsx # dynamic OG per locale
│   │   └── legal/{privacy,cookies}/page.tsx
│   ├── layout.tsx              # passthrough root layout
│   ├── globals.css             # Tailwind v4 theme + dark cinematic tokens
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/{nav,language-switcher}.tsx
│   └── sections/{hero,shift,pillars,flow,graph,team,future,proof,opensource,call,footer}.tsx
├── i18n/{routing,request,navigation}.ts
├── lib/stats.ts                # SkillBrain MCP stats + GitHub stars (ISR 1h)
├── server-actions/submit-contact.ts
└── proxy.ts                    # next-intl locale proxy (formerly middleware)
messages/{it,en,cs}.json
```

## Roadmap

This repo is the **marketing website**. The product itself lives at
[deve1993/skillbrain](https://github.com/deve1993/skillbrain).

- **Sprint 1** ✅ Foundation — i18n, 11 sections (placeholder visuals), form, SEO, Docker
- **Sprint 2** Hero impact — Veo 3 videos for Hero/Shift/Pillar Memory, parallax, Lighthouse ≥90
- **Sprint 3** Cinematic full — remaining videos, Flow scroll-jack, R3F graph, Future teaser, launch
