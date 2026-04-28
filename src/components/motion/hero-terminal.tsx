"use client";

import { useEffect, useRef, useState } from "react";

type Kind = "cmd" | "ok" | "info" | "blank";
type Line = { text: string; kind: Kind };

const SESSION: Line[] = [
  { text: '$ memory_search({ query: "stripe checkout" })', kind: "cmd" },
  { text: "  ✓ 3 memories found  ·  Pattern · Decision · BugFix", kind: "ok" },
  { text: "", kind: "blank" },
  { text: '$ skill_read({ name: "payments" })', kind: "cmd" },
  { text: "  ✓ payments skill loaded", kind: "ok" },
  { text: "    87 patterns · 12 decisions · last used 2h ago", kind: "info" },
  { text: "", kind: "blank" },
  { text: "$ // AI now writes project-aware code...", kind: "cmd" },
  { text: "  ✓ checkout.tsx · webhook.ts · .env updated", kind: "ok" },
  { text: "", kind: "blank" },
  { text: '$ memory_add({ type: "Pattern", skill: "payments" })', kind: "cmd" },
  { text: "  ✓ saved — next session will remember", kind: "ok" },
];

const KIND_COLOR: Record<Kind, string> = {
  cmd: "var(--color-cyan)",
  ok: "var(--color-accent)",
  info: "var(--color-muted)",
  blank: "transparent",
};

export function HeroTerminal() {
  const [completedLines, setCompletedLines] = useState<Line[]>([]);
  const [typingText, setTypingText] = useState("");
  const [typingKind, setTypingKind] = useState<Kind>("cmd");
  const scrollRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ lineIdx: 0, charIdx: 0 });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let timer: ReturnType<typeof setTimeout>;

    const advance = () => {
      if (!mounted.current) return;
      const { lineIdx, charIdx } = stateRef.current;

      if (lineIdx >= SESSION.length) {
        timer = setTimeout(() => {
          if (!mounted.current) return;
          stateRef.current = { lineIdx: 0, charIdx: 0 };
          setCompletedLines([]);
          setTypingText("");
          advance();
        }, 2400);
        return;
      }

      const line = SESSION[lineIdx];

      if (line.kind === "blank" || charIdx >= line.text.length) {
        setCompletedLines((prev) => [...prev, line]);
        setTypingText("");
        stateRef.current = { lineIdx: lineIdx + 1, charIdx: 0 };
        timer = setTimeout(advance, line.kind === "blank" ? 60 : 200);
        return;
      }

      const newCharIdx = charIdx + 1;
      stateRef.current.charIdx = newCharIdx;
      setTypingKind(line.kind);
      setTypingText(line.text.slice(0, newCharIdx));

      const delay =
        line.kind === "cmd" ? 22 + Math.random() * 16 : 10 + Math.random() * 6;
      timer = setTimeout(advance, delay);
    };

    timer = setTimeout(advance, 600);
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [completedLines, typingText]);

  return (
    <div className="relative w-full h-full rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-sm overflow-hidden">
      {/* Outer glow */}
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none opacity-30"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent), var(--color-cyan))",
        }}
        aria-hidden
      />

      {/* Chrome bar */}
      <div className="relative flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-surface/60">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-4 font-mono text-[10px] text-subtle uppercase tracking-wider flex-1 text-center">
          skillbrain · ~/projects/donations
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" aria-hidden />
          connected
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="relative p-5 font-mono text-[11px] leading-relaxed overflow-y-auto h-[calc(100%-44px)]"
      >
        {completedLines.map((line, i) => (
          <div
            key={i}
            style={{ color: KIND_COLOR[line.kind], minHeight: "1.5rem" }}
          >
            {line.text || " "}
          </div>
        ))}
        {typingText && (
          <div style={{ color: KIND_COLOR[typingKind] }}>
            {typingText}
            <span
              className="inline-block w-[0.45em] h-[0.8em] align-middle ml-0.5 animate-pulse rounded-sm"
              style={{ backgroundColor: KIND_COLOR[typingKind], opacity: 0.85 }}
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}
