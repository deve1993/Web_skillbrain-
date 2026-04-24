type LogoProps = {
  className?: string;
  variant?: "full" | "mark";
};

export function Logo({ className, variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 32 32"
        className={className}
        role="img"
        aria-label="SkillBrain"
      >
        <defs>
          <linearGradient id="sb-mark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-cyan)" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14" stroke="url(#sb-mark-grad)" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="5" fill="url(#sb-mark-grad)" />
        <circle cx="6" cy="11" r="1.6" fill="var(--color-foreground)" opacity="0.85" />
        <circle cx="26" cy="11" r="1.6" fill="var(--color-foreground)" opacity="0.85" />
        <circle cx="6" cy="21" r="1.6" fill="var(--color-foreground)" opacity="0.85" />
        <circle cx="26" cy="21" r="1.6" fill="var(--color-foreground)" opacity="0.85" />
        <line x1="6" y1="11" x2="11" y2="14" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="0.7" />
        <line x1="26" y1="11" x2="21" y2="14" stroke="var(--color-cyan)" strokeOpacity="0.5" strokeWidth="0.7" />
        <line x1="6" y1="21" x2="11" y2="18" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="0.7" />
        <line x1="26" y1="21" x2="21" y2="18" stroke="var(--color-cyan)" strokeOpacity="0.5" strokeWidth="0.7" />
      </svg>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Logo variant="mark" className="h-7 w-7" />
      <span className="font-display text-xl tracking-tight text-foreground">
        SkillBrain
      </span>
    </span>
  );
}
