"use client";

import { motion, useReducedMotion } from "framer-motion";

type Tone = 0 | 1 | 2;

type Tag = { name: string; tone: Tone; size: "sm" | "md" | "xs" };

const SKILLS: Tag[] = [
  { name: "nextjs", tone: 1, size: "md" },
  { name: "tailwind", tone: 0, size: "sm" },
  { name: "payments", tone: 2, size: "md" },
  { name: "auth", tone: 0, size: "sm" },
  { name: "database", tone: 1, size: "sm" },
  { name: "seo", tone: 0, size: "xs" },
  { name: "animations", tone: 2, size: "md" },
  { name: "email", tone: 0, size: "xs" },
  { name: "forms", tone: 0, size: "xs" },
  { name: "i18n", tone: 1, size: "xs" },
  { name: "coolify", tone: 0, size: "sm" },
  { name: "docker", tone: 0, size: "sm" },
  { name: "remotion", tone: 2, size: "md" },
  { name: "n8n", tone: 1, size: "xs" },
  { name: "ai-sdk", tone: 2, size: "md" },
  { name: "trpc", tone: 0, size: "sm" },
  { name: "realtime", tone: 1, size: "sm" },
  { name: "graphql", tone: 0, size: "sm" },
  { name: "postgres", tone: 0, size: "sm" },
  { name: "redis", tone: 1, size: "xs" },
  { name: "performance", tone: 0, size: "sm" },
  { name: "security", tone: 2, size: "sm" },
  { name: "monitoring", tone: 0, size: "sm" },
  { name: "pwa", tone: 0, size: "xs" },
  { name: "typescript", tone: 1, size: "md" },
  { name: "shadcn", tone: 0, size: "sm" },
  { name: "payload", tone: 2, size: "sm" },
  { name: "ci-cd", tone: 0, size: "xs" },
  { name: "devops", tone: 1, size: "sm" },
  { name: "rag", tone: 2, size: "sm" },
];

const TONE_CLASS: Record<Tone, string> = {
  0: "border-border/50 text-muted",
  1: "border-cyan/35 text-cyan",
  2: "border-accent/35 text-accent",
};

const SIZE_CLASS: Record<Tag["size"], string> = {
  md: "text-[11px] px-3 py-1",
  sm: "text-[10px] px-2.5 py-0.5",
  xs: "text-[9px] px-2 py-0.5",
};

export function SkillsCloud({ count = 253 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-wrap content-center gap-1.5 p-3 overflow-hidden"
      role="img"
      aria-label={`${count} skills cloud`}
    >
      {SKILLS.map((skill, i) => (
        <motion.span
          key={skill.name}
          className={`inline-flex items-center rounded-full border font-mono leading-none ${TONE_CLASS[skill.tone]} ${SIZE_CLASS[skill.size]}`}
          initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.35,
            delay: i * 0.035,
            ease: [0.19, 1, 0.22, 1],
          }}
          whileHover={{ scale: 1.08 }}
        >
          {skill.name}
        </motion.span>
      ))}
      {/* Count badge */}
      <motion.span
        className="inline-flex items-center rounded-full border border-foreground/20 text-foreground/40 text-[9px] px-2 py-0.5 font-mono leading-none"
        initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.35, delay: SKILLS.length * 0.035 }}
      >
        +{count - SKILLS.length} more
      </motion.span>
    </div>
  );
}
