import type { MDXComponents } from "mdx/types";

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export const docsMdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-foreground mb-6 mt-0">{children}</h1>
  ),
  h2: ({ children }) => {
    const id = slugify(String(children));
    return (
      <h2
        id={id}
        className="text-xl font-semibold text-foreground mt-10 mb-4 scroll-mt-20"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(String(children));
    return (
      <h3
        id={id}
        className="text-base font-semibold text-foreground mt-6 mb-3 scroll-mt-20"
      >
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="text-muted leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children, className }) => {
    const isBlock = Boolean(className);
    if (isBlock) return <code className={className}>{children}</code>;
    return (
      <code className="bg-surface font-mono text-cyan text-[0.8em] px-1.5 py-0.5 rounded">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-surface border border-white/[0.06] rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono text-muted">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/50 bg-surface pl-4 py-3 pr-3 rounded-r-lg mb-4 text-muted italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent-soft hover:text-foreground underline underline-offset-2 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  hr: () => <hr className="border-white/[0.06] my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left font-semibold text-foreground px-3 py-2 border-b border-white/[0.06]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-muted px-3 py-2 border-b border-white/[0.06]">
      {children}
    </td>
  ),
};
