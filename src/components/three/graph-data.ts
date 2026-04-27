/* Shared graph data — no Three.js dependency so it can be imported by DOM components */

export interface GraphNodeData {
  id: number;
  name: string;
  pos: [number, number, number];
  size: number;
  type: "core" | "module" | "function";
  deps: number;
  patterns: number;
  lastUsed: string;
  parentId?: number;
}

export interface GraphEdge { from: number; to: number }

export const TYPE_META: Record<GraphNodeData["type"], { color: string; label: string }> = {
  core: { color: "#7c3aed", label: "Core" },
  module: { color: "#06b6d4", label: "Modulo" },
  function: { color: "#9f7aea", label: "Funzione" },
};

export function generateGraphData() {
  const nodes: GraphNodeData[] = [];
  const edges: GraphEdge[] = [];

  // ── Central hub ──
  nodes.push({
    id: 0, name: "skillbrain/", pos: [0, 0, 0], size: 0.45,
    type: "core", deps: 8, patterns: 45, lastUsed: "now",
  });

  // ── Module ring ──
  const modules = [
    { name: "auth.ts", deps: 4, patterns: 12, lastUsed: "2h ago" },
    { name: "stripe/", deps: 3, patterns: 8, lastUsed: "1h ago" },
    { name: "db.ts", deps: 5, patterns: 15, lastUsed: "30m ago" },
    { name: "api/routes", deps: 4, patterns: 10, lastUsed: "15m ago" },
    { name: "hooks/", deps: 3, patterns: 7, lastUsed: "45m ago" },
    { name: "utils/", deps: 2, patterns: 5, lastUsed: "3h ago" },
    { name: "config.ts", deps: 3, patterns: 6, lastUsed: "1d ago" },
    { name: "middleware.ts", deps: 2, patterns: 4, lastUsed: "4h ago" },
  ];

  modules.forEach((mod, i) => {
    const a = (i / modules.length) * Math.PI * 2;
    const id = nodes.length;
    nodes.push({
      ...mod,
      id,
      pos: [Math.cos(a) * 2.4, Math.sin(a) * 0.4, Math.sin(a) * 2.4],
      size: 0.25, type: "module",
    });
    edges.push({ from: 0, to: id });
  });

  // ── Function ring ──
  const fns: { name: string; parent: number; deps: number; patterns: number; lastUsed: string }[] = [
    { name: "validateToken", parent: 1, deps: 2, patterns: 3, lastUsed: "2h" },
    { name: "refreshSession", parent: 1, deps: 1, patterns: 2, lastUsed: "5h" },
    { name: "createCheckout", parent: 2, deps: 3, patterns: 5, lastUsed: "1h" },
    { name: "handleWebhook", parent: 2, deps: 2, patterns: 3, lastUsed: "3h" },
    { name: "queryBuilder", parent: 3, deps: 4, patterns: 6, lastUsed: "20m" },
    { name: "migrations", parent: 3, deps: 1, patterns: 2, lastUsed: "2d" },
    { name: "seedData", parent: 3, deps: 2, patterns: 1, lastUsed: "1w" },
    { name: "userRoutes", parent: 4, deps: 3, patterns: 4, lastUsed: "15m" },
    { name: "paymentRoutes", parent: 4, deps: 2, patterns: 3, lastUsed: "1h" },
    { name: "useAuth", parent: 5, deps: 2, patterns: 3, lastUsed: "45m" },
    { name: "useToast", parent: 5, deps: 0, patterns: 1, lastUsed: "6h" },
    { name: "formatDate", parent: 6, deps: 0, patterns: 1, lastUsed: "3h" },
    { name: "slugify", parent: 6, deps: 0, patterns: 1, lastUsed: "1d" },
    { name: "envSchema", parent: 7, deps: 1, patterns: 2, lastUsed: "1d" },
    { name: "featureFlags", parent: 7, deps: 2, patterns: 3, lastUsed: "4h" },
    { name: "corsHandler", parent: 8, deps: 1, patterns: 2, lastUsed: "4h" },
    { name: "rateLimit", parent: 8, deps: 1, patterns: 1, lastUsed: "1d" },
  ];

  fns.forEach((fn) => {
    const p = nodes[fn.parent];
    const pAngle = Math.atan2(p.pos[2], p.pos[0]);
    const siblings = fns.filter((f) => f.parent === fn.parent);
    const si = siblings.indexOf(fn);
    const angle = pAngle + (si - (siblings.length - 1) / 2) * 0.28;
    const r = 4.2;
    const y = p.pos[1] + (si - (siblings.length - 1) / 2) * 0.5;
    const id = nodes.length;
    nodes.push({
      id, name: fn.name,
      pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
      size: 0.13, type: "function", parentId: fn.parent,
      deps: fn.deps, patterns: fn.patterns, lastUsed: fn.lastUsed,
    });
    edges.push({ from: fn.parent, to: id });
    if (si > 0) edges.push({ from: id - 1, to: id });
  });

  // Cross-module edges
  edges.push({ from: 1, to: 8 }); // auth → middleware
  edges.push({ from: 2, to: 3 }); // stripe → db
  edges.push({ from: 4, to: 1 }); // api → auth
  edges.push({ from: 5, to: 4 }); // hooks → api

  return { nodes, edges };
}

export function getConnectedIds(nodeId: number, edges: GraphEdge[]): Set<number> {
  const s = new Set<number>([nodeId]);
  edges.forEach((e) => {
    if (e.from === nodeId) s.add(e.to);
    if (e.to === nodeId) s.add(e.from);
  });
  return s;
}
