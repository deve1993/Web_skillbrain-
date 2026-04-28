"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

/* ─── Pipeline definition ─── */

interface PipelineLine {
  text: string;
  type: "command" | "result" | "success" | "info" | "divider";
  delay: number; // ms before this line appears
}

function buildPipeline(userPrompt: string): PipelineLine[] {
  return [
    // Step 1 — user prompt echo
    { text: `> "${userPrompt}"`, type: "command", delay: 0 },
    { text: "", type: "divider", delay: 300 },

    // Step 2 — memory search
    { text: "$ memory_search({ query: \"" + userPrompt.slice(0, 40) + "\" })", type: "command", delay: 600 },
    { text: "  searching 103 memories...", type: "info", delay: 1000 },
    { text: "  ✓ 3 memories found · Pattern · Decision · BugFix", type: "success", delay: 1800 },
    { text: "", type: "divider", delay: 2000 },

    // Step 3 — skill load
    { text: "$ skill_read('payments')", type: "command", delay: 2200 },
    { text: "  loading skill from shared brain...", type: "info", delay: 2600 },
    { text: "  ✓ payments skill loaded", type: "success", delay: 3200 },
    { text: "  87 patterns · 12 decisions · last used 2h ago", type: "info", delay: 3500 },
    { text: "", type: "divider", delay: 3700 },

    // Step 4 — execute
    { text: "$ execute({ context: 3, skill: 'payments' })", type: "command", delay: 3900 },
    { text: "  generating checkout.tsx...", type: "info", delay: 4300 },
    { text: "  generating webhook.ts...", type: "info", delay: 4700 },
    { text: "  updating .env.local...", type: "info", delay: 5000 },
    { text: "  ✓ 3 files written · 0 conflicts", type: "success", delay: 5500 },
    { text: "", type: "divider", delay: 5700 },

    // Step 5 — save memory
    { text: "$ memory_add({ type: 'Pattern', skill: 'payments' })", type: "command", delay: 5900 },
    { text: "  ✓ new memory saved — available for the whole team", type: "success", delay: 6500 },
    { text: "", type: "divider", delay: 6800 },

    // Done
    { text: "Done. 5 steps · 3 memories recalled · 1 skill loaded · 3 files written.", type: "result", delay: 7200 },
  ];
}

/* ─── Typing animation hook ─── */

function useTypingText(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

/* ─── Terminal line component ─── */

function TerminalLine({ line, isLast }: { line: PipelineLine; isLast: boolean }) {
  const speed = line.type === "command" ? 22 : 14;
  const { displayed, done } = useTypingText(line.text, speed);

  if (line.type === "divider") {
    return <div className="h-2" />;
  }

  const colorClass =
    line.type === "command"
      ? "text-cyan"
      : line.type === "success"
        ? "text-green-400"
        : line.type === "result"
          ? "text-foreground font-medium"
          : "text-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`font-mono text-xs sm:text-sm leading-relaxed ${colorClass}`}
    >
      {displayed}
      {isLast && !done && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan ml-0.5 animate-pulse align-middle" />
      )}
    </motion.div>
  );
}

/* ─── Suggested prompts ─── */

const SUGGESTIONS = [
  "add a stripe checkout to the donations page",
  "refactor auth middleware to support JWT",
  "create a REST API for user profiles",
  "add dark mode toggle with system detection",
];

/* ─── Main component ─── */

export function Flow() {
  const t = useTranslations("sections.flow");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState<PipelineLine[]>([]);
  const [hasRun, setHasRun] = useState(false);

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const runPipeline = useCallback((userPrompt: string) => {
    const pipeline = buildPipeline(userPrompt);
    setIsRunning(true);
    setVisibleLines([]);
    setHasRun(true);

    const timers: NodeJS.Timeout[] = [];

    pipeline.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        // If last line, mark done
        if (i === pipeline.length - 1) {
          setTimeout(() => setIsRunning(false), 600);
        }
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    const p = prompt.trim();
    setPrompt("");
    runPipeline(p);
  };

  const handleSuggestion = (s: string) => {
    if (isRunning) return;
    setPrompt("");
    runPipeline(s);
  };

  return (
    <section id="flow" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-8 text-lg text-muted leading-relaxed">
            {t("body")}
          </p>
        </div>

        {/* Interactive terminal */}
        <div className="relative rounded-2xl border border-border bg-surface/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-accent/5">
          {/* Terminal chrome */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
              skillbrain · ~/projects/donations · main
            </span>
            <div className="flex items-center gap-2">
              {isRunning && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-cyan uppercase tracking-wider"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                  processing
                </motion.span>
              )}
              {!isRunning && hasRun && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  done
                </span>
              )}
              {!isRunning && !hasRun && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  connected
                </span>
              )}
            </div>
          </div>

          {/* Terminal body */}
          <div className="flex flex-col" style={{ minHeight: "420px" }}>
            {/* Output area */}
            <div
              ref={outputRef}
              className="flex-1 px-5 py-4 overflow-y-auto space-y-1"
              style={{ maxHeight: "360px" }}
            >
              {!hasRun && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <p className="text-muted/60 text-sm font-mono mb-6">
                    Type a prompt below — or pick one:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="px-3 py-1.5 rounded-lg border border-border/60 bg-background/40 text-xs font-mono text-muted hover:text-foreground hover:border-accent/50 transition-colors duration-200 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {visibleLines.map((line, i) => (
                  <TerminalLine
                    key={`${i}-${line.text}`}
                    line={line}
                    isLast={i === visibleLines.length - 1}
                  />
                ))}
              </AnimatePresence>

              {/* Final summary card */}
              {!isRunning && hasRun && visibleLines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4"
                >
                  <p className="text-xs font-mono text-accent-soft uppercase tracking-wider mb-2">
                    Pipeline complete
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    SkillBrain recalled team knowledge, loaded the right skill, generated code,
                    and saved what it learned — all from a single prompt.
                  </p>
                  <button
                    onClick={() => {
                      setVisibleLines([]);
                      setHasRun(false);
                      setIsRunning(false);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="mt-3 text-xs font-mono text-cyan hover:text-cyan-soft transition-colors cursor-pointer"
                  >
                    ↻ Try another prompt
                  </button>
                </motion.div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-border/40 bg-background/60">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-3">
                <span className="font-mono text-cyan text-sm shrink-0">{">"}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isRunning ? "Running..." : "Describe what you want to build..."}
                  className="flex-1 bg-transparent text-sm font-mono text-foreground focus:outline-none placeholder:text-subtle/50 disabled:opacity-40"
                  disabled={isRunning}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={isRunning || !prompt.trim()}
                  className="shrink-0 px-3 py-1.5 rounded-md bg-accent/20 border border-accent/40 text-xs font-mono text-accent-soft hover:bg-accent/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Run ↵
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
