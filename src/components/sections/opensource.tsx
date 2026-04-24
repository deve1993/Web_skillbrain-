"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TypingCode } from "@/components/motion/typing-code";

const tabs = [
  {
    id: "claudeCode",
    path: "~/.claude/mcp.json",
    code: `{
  "mcpServers": {
    "skillbrain": {
      "command": "npx",
      "args": ["-y", "@skillbrain/mcp"],
      "env": { "SKILLBRAIN_URL": "https://memory.fl1.it" }
    }
  }
}`,
  },
  {
    id: "cursor",
    path: "~/.cursor/mcp.json",
    code: `{
  "mcpServers": {
    "skillbrain": {
      "command": "npx",
      "args": ["-y", "@skillbrain/mcp"]
    }
  }
}`,
  },
  {
    id: "codex",
    path: "~/.codex/config.toml",
    code: `[mcp_servers.skillbrain]
command = "npx"
args = ["-y", "@skillbrain/mcp"]`,
  },
] as const;

export function OpenSource() {
  const t = useTranslations("sections.opensource");
  const cta = useTranslations("common.cta");
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("claudeCode");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section
      id="opensource"
      className="relative py-32 md:py-40 border-t border-border/40"
    >
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-8 text-lg text-muted leading-relaxed">{t("body")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="https://github.com/deve1993/skillbrain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-sm"
            >
              {cta("github")}
            </a>
            <a
              href="https://github.com/deve1993/skillbrain#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-accent text-muted hover:text-foreground transition-colors text-sm"
            >
              Docs ↗
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex-1 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active === tab.id
                    ? "text-foreground bg-surface-elevated"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t(`tabs.${tab.id}`)}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-b border-border font-mono text-xs text-subtle">
            {current.path}
          </div>
          <TypingCode
            key={current.id}
            code={current.code}
            speed={120}
            className="p-6"
          />
          <div className="border-t border-border px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
              MIT License · Apache-2.0 dual
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(current.code)}
              className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-foreground transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
