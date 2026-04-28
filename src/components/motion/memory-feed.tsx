"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const MEMORIES = [
  {
    type: "BugFix",
    snippet: "stripe webhook race condition",
    tags: ["#payments", "#nextjs"],
    color: "text-red-400",
    badge: "bg-red-500/15 border-red-500/25 text-red-400",
    dot: "bg-red-400",
  },
  {
    type: "Pattern",
    snippet: "optimistic UI with useMutation",
    tags: ["#react", "#ux"],
    color: "text-violet-300",
    badge: "bg-violet-500/15 border-violet-500/25 text-violet-300",
    dot: "bg-violet-400",
  },
  {
    type: "Decision",
    snippet: "use edge runtime for auth middleware",
    tags: ["#auth", "#performance"],
    color: "text-cyan-300",
    badge: "bg-cyan-500/15 border-cyan-500/25 text-cyan-300",
    dot: "bg-cyan-400",
  },
  {
    type: "AntiPattern",
    snippet: "never mutate shared session state",
    tags: ["#state", "#session"],
    color: "text-orange-300",
    badge: "bg-orange-500/15 border-orange-500/25 text-orange-300",
    dot: "bg-orange-400",
  },
] as const;

export function MemoryFeed() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MEMORIES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const mem = MEMORIES[idx];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        className="bg-[rgba(8,8,14,0.88)] backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 font-mono"
      >
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${mem.dot}`} aria-hidden />
          <span className={`text-[9px] uppercase tracking-[0.2em] border rounded px-1.5 py-0.5 ${mem.badge}`}>
            {mem.type}
          </span>
          <span className="text-[9px] text-white/30 ml-auto">saved · just now</span>
        </div>

        {/* Snippet */}
        <p className="text-[10px] text-white/70 leading-snug truncate max-w-[220px]">
          &ldquo;{mem.snippet}&rdquo;
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-1.5">
          {mem.tags.map((tag) => (
            <span key={tag} className="text-[9px] text-white/30">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
