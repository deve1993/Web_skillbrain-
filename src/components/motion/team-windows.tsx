"use client";

import { motion, useReducedMotion } from "framer-motion";

const WINDOWS = [
  {
    city: "Milano",
    ide: "Claude Code",
    user: "@elisa",
    color: "accent",
    snippet: 'memory_search("hero variants")',
    cursorX: 78,
    cursorY: 60,
  },
  {
    city: "Praha",
    ide: "Cursor",
    user: "@jakub",
    color: "cyan",
    snippet: "skill_read('payments')",
    cursorX: 30,
    cursorY: 72,
  },
  {
    city: "Berlin",
    ide: "VS Code",
    user: "@lena",
    color: "accent-soft",
    snippet: "memory_add(BugFix)",
    cursorX: 55,
    cursorY: 45,
  },
  {
    city: "Lisboa",
    ide: "Codex",
    user: "@rafa",
    color: "accent",
    snippet: "session_resume(donations)",
    cursorX: 22,
    cursorY: 38,
  },
] as const;

export function TeamWindows() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3">
      {WINDOWS.map((w, i) => (
        <motion.div
          key={w.city}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.19, 1, 0.22, 1] }}
          className={`group relative aspect-video rounded-xl border border-white/[0.08] overflow-hidden bg-[rgba(13,13,20,0.72)] backdrop-blur-md ${
            i === 0
              ? "shadow-[0_8px_40px_-12px_rgba(124,58,237,0.25)]"
              : i === 1
                ? "shadow-[0_8px_40px_-12px_rgba(6,182,212,0.20)]"
                : "shadow-[0_8px_40px_-12px_rgba(159,122,234,0.18)]"
          }`}
        >
          {/* IDE chrome */}
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-1.5">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-danger/50 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="h-2 w-2 rounded-full bg-accent-soft/50 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="h-2 w-2 rounded-full bg-cyan/50 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-subtle">
              {w.ide}
            </span>
            <span className="font-mono text-[9px] text-subtle">{w.user}</span>
          </div>

          {/* Code area */}
          <div className="relative h-full p-3 font-mono text-[10px] leading-snug">
            <div className="text-subtle">// {w.city}</div>
            <div className="text-muted truncate">
              <motion.span
                initial={prefersReducedMotion ? false : { width: 0 }}
                whileInView={{ width: "auto" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 1.2,
                  delay: 0.4 + i * 0.15,
                  ease: "easeOut",
                }}
                className="inline-block overflow-hidden whitespace-nowrap align-bottom"
              >
                {w.snippet}
              </motion.span>
              <motion.span
                animate={prefersReducedMotion ? undefined : { opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="inline-block w-1 h-2.5 bg-foreground/80 align-middle ml-0.5"
                aria-hidden
              />
            </div>

            {/* Floating cursor */}
            <motion.div
              className={`absolute pointer-events-none ${
                w.color === "cyan"
                  ? "text-cyan"
                  : w.color === "accent-soft"
                    ? "text-accent-soft"
                    : "text-accent"
              }`}
              style={{ left: `${w.cursorX}%`, top: `${w.cursorY}%` }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      x: [0, 8, -4, 0],
                      y: [0, -3, 6, 0],
                    }
              }
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
                <path d="M0 0l5 12 2-5 5-2L0 0z" />
              </svg>
              <div className="text-[8px] font-mono uppercase tracking-wider mt-0.5">
                {w.user}
              </div>
            </motion.div>
          </div>

          {/* Live dot */}
          <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full pulse-glow ${
                w.color === "cyan" ? "bg-cyan" : "bg-accent"
              }`}
            />
            live
          </div>
        </motion.div>
      ))}
    </div>
  );
}
