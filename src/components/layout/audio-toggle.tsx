"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "skillbrain:audio";

export function AudioToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setEnabled(true);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    document.documentElement.dataset.audio = next ? "on" : "off";
    document.querySelectorAll<HTMLVideoElement>("video[data-cinematic]").forEach((v) => {
      v.muted = !next;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute cinematic audio" : "Enable cinematic audio"}
      className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-full border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
      title={enabled ? "Audio on" : "Audio off"}
    >
      {enabled ? <SpeakerOn /> : <SpeakerOff />}
    </button>
  );
}

function SpeakerOn() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6v4h2l3 2.5v-9L5 6H3z" />
      <path d="M11 5.5a3 3 0 0 1 0 5" />
      <path d="M12.5 4a5 5 0 0 1 0 8" opacity="0.6" />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6v4h2l3 2.5v-9L5 6H3z" />
      <path d="M11 6l3 4M14 6l-3 4" />
    </svg>
  );
}
