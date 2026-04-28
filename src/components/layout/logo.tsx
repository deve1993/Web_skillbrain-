import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "full" | "mark";
};

export function Logo({ className, variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return (
      <Image
        src="/logo.svg"
        alt="SkillBrain"
        width={32}
        height={32}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Image
        src="/logo.svg"
        alt="SkillBrain"
        width={32}
        height={32}
        className="h-8 w-8 flex-shrink-0"
        unoptimized
      />
      <span className="font-display text-xl tracking-tight text-foreground">
        SkillBrain
      </span>
    </span>
  );
}
