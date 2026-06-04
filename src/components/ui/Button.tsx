import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "accent" | "lock";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold cursor-pointer border-0 rounded-[11px] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2",
          size === "sm" && "px-[9px] py-[5px] text-[11.5px]",
          size === "md" && "px-[13px] py-[8px] text-[12.5px]",
          size === "lg" && "px-[17px] py-[10px] text-[13px]",
          variant === "primary" && [
            "bg-[var(--primary)] text-white",
            "shadow-[0_1px_2px_rgba(22,105,231,.3),0_6px_16px_rgba(22,105,231,.22)]",
            "hover:bg-[var(--primary-700)] hover:-translate-y-px",
          ],
          variant === "ghost" && [
            "bg-white text-[var(--navy)] border border-[var(--line)]",
            "hover:border-[var(--navy)]",
          ],
          variant === "accent" && [
            "bg-[var(--accent)] text-white",
            "shadow-[0_1px_2px_rgba(22,163,74,.3),0_4px_12px_rgba(22,163,74,.22)]",
            "hover:brightness-105 hover:-translate-y-px",
          ],
          variant === "lock" && [
            "bg-[var(--accent)] text-white",
            "shadow-[0_1px_2px_rgba(22,163,74,.3),0_4px_12px_rgba(22,163,74,.22)]",
            "hover:brightness-105 hover:-translate-y-px whitespace-nowrap",
          ],
          props.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
