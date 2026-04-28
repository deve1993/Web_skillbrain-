"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

/* ─── Memory log entries ─── */

interface MemoryEntry {
  id: number;
  type: "pattern" | "decision" | "bugfix" | "fact";
  action: "saved" | "recalled";
  text: string;
}

const TYPE_COLORS: Record<MemoryEntry["type"], string> = {
  pattern: "var(--color-accent)",
  decision: "var(--color-cyan)",
  bugfix: "var(--color-accent-soft)",
  fact: "var(--color-cyan-soft)",
};

const TYPE_LABELS: Record<MemoryEntry["type"], string> = {
  pattern: "Pattern",
  decision: "Decision",
  bugfix: "BugFix",
  fact: "Fact",
};

const MEMORY_POOL: Omit<MemoryEntry, "id">[] = [
  { type: "pattern", action: "saved", text: "use Stripe Checkout v2 for payments" },
  { type: "decision", action: "recalled", text: "JWT tokens over session cookies" },
  { type: "bugfix", action: "saved", text: "race condition in webhook handler" },
  { type: "fact", action: "recalled", text: "DB uses connection pooling (max 20)" },
  { type: "pattern", action: "recalled", text: "error boundaries wrap each route" },
  { type: "decision", action: "saved", text: "Zod for all API validation" },
  { type: "bugfix", action: "recalled", text: "timezone offset in cron scheduler" },
  { type: "fact", action: "saved", text: "rate limit: 100 req/min per API key" },
  { type: "pattern", action: "saved", text: "Server Actions for all mutations" },
  { type: "decision", action: "recalled", text: "pnpm workspaces, no monorepo tool" },
  { type: "bugfix", action: "saved", text: "hydration mismatch on locale switch" },
  { type: "fact", action: "recalled", text: "Resend API for transactional emails" },
];

/* ─── Typing text hook ─── */

function useTyping(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return { displayed, done };
}

/* ─── Single memory line ─── */

function MemoryLine({ entry, isLatest }: { entry: MemoryEntry; isLatest: boolean }) {
  const prefix = entry.action === "saved" ? "✓" : "→";
  const actionLabel = entry.action === "saved" ? "saved" : "recalled";
  const fullText = `${TYPE_LABELS[entry.type]} ${actionLabel}: "${entry.text}"`;
  const { displayed, done } = useTyping(isLatest ? fullText : "", 16);
  const color = TYPE_COLORS[entry.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2 font-mono text-[11px] leading-relaxed"
    >
      <span style={{ color }} className="shrink-0 mt-px">
        {prefix}
      </span>
      <span className="text-muted/90">
        {isLatest ? (
          <>
            {displayed}
            {!done && (
              <span
                className="inline-block w-1 h-3 ml-0.5 align-middle animate-pulse"
                style={{ backgroundColor: color }}
              />
            )}
          </>
        ) : (
          fullText
        )}
      </span>
    </motion.div>
  );
}

/* ─── Main component ─── */

export function KnowledgeGraph({ memoryCount = 103 }: { memoryCount?: number }) {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [counter, setCounter] = useState(0);

  const addEntry = useCallback(() => {
    const template = MEMORY_POOL[counter % MEMORY_POOL.length];
    const newEntry: MemoryEntry = { ...template, id: Date.now() };
    setEntries((prev) => [...prev.slice(-4), newEntry]); // keep max 5 visible
    setCounter((c) => c + 1);
  }, [counter]);

  useEffect(() => {
    // Initial delay, then add first entry
    const initial = setTimeout(addEntry, 800);
    return () => clearTimeout(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (counter === 0) return;
    const timer = setTimeout(addEntry, 2800 + Math.random() * 800);
    return () => clearTimeout(timer);
  }, [counter, addEntry]);

  // Count by type
  const typeCounts = entries.reduce(
    (acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="w-full h-full flex flex-col justify-between py-3 px-4">
      {/* Header — counter */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
            Memory Stream
          </span>
        </div>
        <span className="font-mono text-xs text-foreground/80 tabular-nums">
          {memoryCount + counter} active
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 flex flex-col justify-end gap-1.5 overflow-hidden min-h-0">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, i) => (
            <MemoryLine
              key={entry.id}
              entry={entry}
              isLatest={i === entries.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer — type badges */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/20">
        {(Object.entries(TYPE_LABELS) as [MemoryEntry["type"], string][]).map(([type, label]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-background/30"
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span className="font-mono text-[9px] text-subtle uppercase">
              {label}
            </span>
            {typeCounts[type] && (
              <span className="font-mono text-[9px] text-muted tabular-nums">
                {typeCounts[type]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
