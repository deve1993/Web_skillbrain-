"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { LazyCodebaseGraph } from "@/components/three/lazy-codebase-graph";
import { generateGraphData, getConnectedIds, TYPE_META, type GraphNodeData } from "@/components/three/graph-data";

export function Graph() {
  const t = useTranslations("sections.graph");

  const { nodes, edges } = useMemo(() => generateGraphData(), []);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const activeId = selectedId ?? hoveredId;
  const activeNode = activeId !== null ? nodes[activeId] : null;

  const connectedNodes = useMemo(() => {
    if (activeId === null) return [];
    const ids = getConnectedIds(activeId, edges);
    return nodes.filter((n) => ids.has(n.id) && n.id !== activeId);
  }, [activeId, nodes, edges]);

  // Stats
  const totalEdges = edges.length;
  const modulesCount = nodes.filter((n) => n.type === "module").length;
  const functionsCount = nodes.filter((n) => n.type === "function").length;

  return (
    <section id="graph" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 mesh-bg-animated opacity-25" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <Reveal direction="up">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal direction="up" delay={0.15}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground max-w-3xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.3}>
          <p className="mt-8 text-lg text-muted leading-relaxed max-w-2xl">
            {t("body")}
          </p>
        </Reveal>

        {/* Graph + Sidebar */}
        <Reveal direction="up" delay={0.4}>
          <div className="mt-16 grid lg:grid-cols-5 gap-5">
            {/* ── Canvas ── */}
            <div className="lg:col-span-3 relative aspect-[4/3] lg:aspect-auto lg:h-[560px] rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-sm overflow-hidden">
              {/* SVG fallback */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                <svg viewBox="0 0 800 450" className="w-2/3 h-2/3 opacity-30">
                  <defs>
                    <radialGradient id="gf" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="400" cy="225" r="80" fill="url(#gf)" />
                  <circle cx="400" cy="225" r="14" fill="var(--color-accent)" />
                </svg>
              </div>

              <LazyCodebaseGraph
                nodes={nodes}
                edges={edges}
                hoveredId={hoveredId}
                selectedId={selectedId}
                onHover={setHoveredId}
                onSelect={setSelectedId}
              />

              <div className="absolute bottom-4 left-4 font-mono text-xs text-subtle pointer-events-none">
                codegraph · click to inspect
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-xs text-subtle pointer-events-none flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" />
                live
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Stats card */}
              <div className="rounded-xl border border-border/40 bg-surface/60 backdrop-blur-md p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-4">
                  CodeGraph · Overview
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Stat value={nodes.length} label="Nodi" />
                  <Stat value={totalEdges} label="Connessioni" />
                  <Stat value={modulesCount} label="Moduli" />
                  <Stat value={functionsCount} label="Funzioni" />
                </div>
              </div>

              {/* Legend */}
              <div className="rounded-xl border border-border/40 bg-surface/60 backdrop-blur-md p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-4">
                  Legenda
                </p>
                <div className="space-y-2.5">
                  {(Object.entries(TYPE_META) as [GraphNodeData["type"], { color: string; label: string }][]).map(
                    ([type, meta]) => (
                      <div key={type} className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}60` }}
                        />
                        <span className="text-sm text-muted">{meta.label}</span>
                        <span className="ml-auto font-mono text-xs text-subtle tabular-nums">
                          {nodes.filter((n) => n.type === type).length}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Node detail panel (E) */}
              <AnimatePresence mode="wait">
                {activeNode ? (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-md p-6 flex-1"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: TYPE_META[activeNode.type].color,
                          boxShadow: `0 0 12px ${TYPE_META[activeNode.type].color}80`,
                        }}
                      />
                      <span className="font-mono text-base text-foreground font-medium">
                        {activeNode.name}
                      </span>
                      <span className="ml-auto px-2 py-0.5 rounded-md bg-surface/60 border border-border/40 text-[10px] font-mono uppercase tracking-wider text-subtle">
                        {TYPE_META[activeNode.type].label}
                      </span>
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <MiniStat value={activeNode.deps} label="Dipendenze" />
                      <MiniStat value={activeNode.patterns} label="Pattern" />
                      <MiniStat value={activeNode.lastUsed} label="Ultimo uso" />
                    </div>

                    {/* Connected nodes */}
                    {connectedNodes.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-3">
                          Connesso a
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {connectedNodes.map((cn) => (
                            <button
                              key={cn.id}
                              onClick={() => setSelectedId(cn.id)}
                              className="px-2 py-1 rounded-md bg-surface/60 border border-border/40 text-xs font-mono text-muted hover:text-foreground hover:border-accent/50 transition-colors cursor-pointer"
                            >
                              {cn.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-border/20 bg-surface/30 backdrop-blur-md p-6 flex-1 flex items-center justify-center"
                  >
                    <p className="text-sm text-subtle text-center font-mono">
                      Hover o clicca un nodo<br />per ispezionarlo
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Small UI atoms ── */

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-mono text-foreground tabular-nums font-medium">{value}</p>
      <p className="text-xs text-subtle mt-0.5">{label}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-sm font-mono text-foreground tabular-nums">{value}</p>
      <p className="text-[10px] text-subtle mt-0.5">{label}</p>
    </div>
  );
}
