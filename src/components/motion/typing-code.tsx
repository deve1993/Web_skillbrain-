"use client";

import { useEffect, useRef, useState } from "react";

type TypingCodeProps = {
  code: string;
  speed?: number;
  className?: string;
  resetOnChange?: boolean;
};

export function TypingCode({
  code,
  speed = 14,
  className,
  resetOnChange = true,
}: TypingCodeProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLPreElement>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      inViewRef.current = true;
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              inViewRef.current = true;
              io.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
  }, []);

  useEffect(() => {
    if (resetOnChange) {
      setShown("");
      setDone(false);
    }

    let idx = 0;
    let raf = 0;
    let last = 0;
    const step = (t: number) => {
      if (!inViewRef.current) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (t - last >= 1000 / speed) {
        idx++;
        setShown(code.slice(0, idx));
        last = t;
      }
      if (idx < code.length) {
        raf = requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [code, speed, resetOnChange]);

  return (
    <pre
      ref={ref}
      className={`relative font-mono text-sm text-foreground overflow-x-auto leading-relaxed ${className ?? ""}`}
    >
      <code>
        {shown}
        {!done && (
          <span
            className="inline-block w-[0.5em] h-[1em] bg-foreground/80 align-middle ml-0.5 animate-pulse"
            aria-hidden
          />
        )}
      </code>
    </pre>
  );
}
