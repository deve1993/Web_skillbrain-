"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_THREADS, type AgentTask, type TaskStatus } from "@/lib/agentic-tasks";

const STATUS_ICON: Record<TaskStatus, string> = {
  done: "✓",
  running: "⟳",
  pending: "○",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  done: "text-emerald-400",
  running: "text-violet-400",
  pending: "text-white/30",
};

function TaskRow({ task, delay }: { task: AgentTask; delay: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.19, 1, 0.22, 1] }}
      className="flex items-center gap-2 font-mono text-[11px] py-1"
    >
      <span className={`${STATUS_COLOR[task.status]} flex-shrink-0 w-3 text-center`}>
        {STATUS_ICON[task.status]}
      </span>
      <span
        className={
          task.status === "done"
            ? "text-white/50"
            : task.status === "running"
              ? "text-white/90"
              : "text-white/25"
        }
      >
        {task.label}
        {task.status === "done" && task.duration && (
          <span className="text-white/30 ml-1">· {task.duration}</span>
        )}
      </span>
      {task.status === "running" && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block w-1 h-2 bg-violet-400 align-middle"
          aria-hidden
        />
      )}
    </motion.div>
  );
}

type AgentThreadsProps = {
  poolIndex?: number;
};

export function AgentThreads({ poolIndex = 0 }: AgentThreadsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentPool, setCurrentPool] = useState(poolIndex);
  const tickRef = useRef(0);

  // Cycle through task pools every 8s to avoid repetition
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      tickRef.current += 1;
      setCurrentPool((prev) => (prev + 1) % AGENTIC_THREADS[0].tasks.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
      {AGENTIC_THREADS.map((thread, ti) => {
        const tasks: AgentTask[] = thread.tasks[currentPool];
        return (
          <div
            key={thread.id}
            className="bg-[rgba(10,10,18,0.7)] border border-white/[0.06] rounded-xl p-3 md:p-4 min-h-[160px]"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3 pb-2 border-b border-white/[0.06]">
              {thread.label}
            </div>
            <div className="space-y-0.5">
              {tasks.map((task, i) => (
                <TaskRow
                  key={`${currentPool}-${ti}-${i}`}
                  task={task}
                  delay={ti * 0.15 + i * 0.08}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
