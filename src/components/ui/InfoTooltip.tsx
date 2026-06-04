"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center w-[17px] h-[17px] ml-[7px] rounded-full border border-[var(--line)] text-[var(--muted)] bg-white cursor-help align-middle flex-shrink-0",
        "hover:border-[var(--primary)] hover:text-[var(--primary)]",
        open && "border-[var(--primary)] text-[var(--primary)]",
        className
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Info size={10} />

      <div
        className={cn(
          "absolute top-[calc(100%+9px)] left-1/2 w-[300px] max-w-[78vw] rounded-[11px] px-[13px] py-3 text-[12px] leading-[1.55] z-[60] text-left pointer-events-none transition-all duration-150",
          "text-[#e8f0fd] font-normal normal-case tracking-normal",
          open ? "opacity-100 visible translate-x-[-50%]" : "opacity-0 invisible translate-x-[-50%] translate-y-1"
        )}
        style={{
          background: "#1c1c26",
          boxShadow: "0 14px 40px rgba(20,18,40,.34)",
        }}
      >
        {/* Arrow */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent"
          style={{ borderBottomColor: "#1c1c26" }}
        />
        {content}
      </div>
    </span>
  );
}
