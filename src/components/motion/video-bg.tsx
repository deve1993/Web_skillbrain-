"use client";

import { useEffect, useRef } from "react";

type VideoBgProps = {
  src: string;
  opacity?: number;
  className?: string;
};

export function VideoBg({ src, opacity = 0.4, className }: VideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className ?? ""}`}
      style={{ opacity }}
      onError={(e) => {
        (e.currentTarget as HTMLVideoElement).style.display = "none";
      }}
    />
  );
}
