import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "accent" | "up" | "down" | "primary" | "muted";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[11px] py-[5px] rounded-full text-[11.5px] font-semibold border",
        variant === "default" && "bg-[var(--chip)] border-[var(--line)] text-[var(--navy)]",
        variant === "accent" && "bg-[var(--accent-soft)] border-[#c4e0c7] text-[var(--accent)]",
        variant === "up" && "bg-[#fdeaed] border-[#f9c0cc] text-[var(--up)]",
        variant === "down" && "bg-[var(--accent-soft)] border-[#c4e0c7] text-[var(--down)]",
        variant === "primary" && "bg-[var(--primary-soft)] border-[#e0dbff] text-[var(--primary)]",
        variant === "muted" && "bg-[var(--chip)] border-[var(--line)] text-[var(--muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}

interface ConfidenceDotProps {
  level: "high" | "medium" | "low";
  className?: string;
}

export function ConfidenceDot({ level, className }: ConfidenceDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full flex-shrink-0",
        level === "high" && "bg-[#2e7d32]",
        level === "medium" && "bg-[#e0a32e]",
        level === "low" && "bg-[#d1495b]",
        className
      )}
    />
  );
}
