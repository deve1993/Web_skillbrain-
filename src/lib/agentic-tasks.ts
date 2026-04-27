export type TaskStatus = "done" | "running" | "pending";

export type AgentTask = {
  label: string;
  status: TaskStatus;
  duration?: string;
};

export type ThreadPool = {
  id: "code" | "research" | "deploy";
  label: string;
  tasks: AgentTask[][];
};

export const AGENTIC_THREADS: ThreadPool[] = [
  {
    id: "code",
    label: "T01 CODE",
    tasks: [
      [
        { label: "analyzing repo", status: "done", duration: "1.2s" },
        { label: "patching auth flow", status: "done", duration: "3.4s" },
        { label: "writing unit tests", status: "running" },
        { label: "push to branch", status: "pending" },
      ],
      [
        { label: "reading codebase", status: "done", duration: "0.8s" },
        { label: "refactor API layer", status: "done", duration: "4.1s" },
        { label: "add type safety", status: "running" },
        { label: "open PR", status: "pending" },
      ],
      [
        { label: "scan dependencies", status: "done", duration: "1.5s" },
        { label: "upgrade next.js", status: "done", duration: "2.2s" },
        { label: "fix breaking changes", status: "running" },
        { label: "run test suite", status: "pending" },
      ],
      [
        { label: "read memory context", status: "done", duration: "0.4s" },
        { label: "generate component", status: "done", duration: "2.7s" },
        { label: "add i18n strings", status: "running" },
        { label: "visual review", status: "pending" },
      ],
    ],
  },
  {
    id: "research",
    label: "T02 RESEARCH",
    tasks: [
      [
        { label: "web search: competitors", status: "done", duration: "2.1s" },
        { label: "extract key patterns", status: "done", duration: "1.8s" },
        { label: "synthesizing report", status: "running" },
        { label: "save to memory", status: "pending" },
      ],
      [
        { label: "fetch docs: stripe", status: "done", duration: "0.9s" },
        { label: "map API endpoints", status: "done", duration: "1.3s" },
        { label: "draft integration plan", status: "running" },
        { label: "propose implementation", status: "pending" },
      ],
      [
        { label: "search: pricing models", status: "done", duration: "3.0s" },
        { label: "compare 6 options", status: "done", duration: "2.4s" },
        { label: "ranking by fit", status: "running" },
        { label: "present summary", status: "pending" },
      ],
      [
        { label: "load skill: nextjs", status: "done", duration: "0.3s" },
        { label: "read memory context", status: "done", duration: "0.5s" },
        { label: "plan architecture", status: "running" },
        { label: "propose file structure", status: "pending" },
      ],
    ],
  },
  {
    id: "deploy",
    label: "T03 DEPLOY",
    tasks: [
      [
        { label: "build production", status: "done", duration: "18s" },
        { label: "run smoke tests", status: "done", duration: "4.2s" },
        { label: "push to coolify", status: "running" },
        { label: "verify health check", status: "pending" },
      ],
      [
        { label: "env var audit", status: "done", duration: "0.7s" },
        { label: "migrate database", status: "done", duration: "6.1s" },
        { label: "deploying edge fn", status: "running" },
        { label: "invalidate CDN cache", status: "pending" },
      ],
      [
        { label: "tag release v2.1", status: "done", duration: "0.2s" },
        { label: "generate changelog", status: "done", duration: "1.9s" },
        { label: "notify Slack", status: "running" },
        { label: "update status page", status: "pending" },
      ],
      [
        { label: "rollback check", status: "done", duration: "0.5s" },
        { label: "blue/green switch", status: "done", duration: "3.3s" },
        { label: "monitoring warmup", status: "running" },
        { label: "close incident", status: "pending" },
      ],
    ],
  },
];
