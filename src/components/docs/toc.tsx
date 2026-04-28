"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string };

type Props = { items: TocItem[]; label: string };

export function DocsToc({ items, label }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Page contents">
      <p className="text-[9px] text-subtle uppercase tracking-[0.2em] font-mono mb-3">
        {label}
      </p>
      <ul className="space-y-2">
        {items.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-xs transition-all ${
                activeId === id
                  ? "text-accent-soft border-l-2 border-accent pl-2"
                  : "text-subtle hover:text-foreground pl-0"
              }`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
