"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface BarGroup {
  group: string;
  shap: number;
  top_value_summary: string;
  items?: { label: string; delta: number }[];
}

interface CostDriverBarsProps {
  /** When provided, renders these groups instead of store groups */
  groups?: BarGroup[];
}

export function CostDriverBars({ groups: propGroups }: CostDriverBarsProps = {}) {
  const styleRecord = useAppStore((s) => s.styleRecord);
  if (!styleRecord) return null;

  const groups: BarGroup[] = propGroups ?? styleRecord.groups;
  const maxAbs = Math.max(...groups.map((g) => Math.abs(g.shap)), 0.01);

  return (
    <div className="flex flex-col gap-3 my-1">
      {groups.map((group) => (
        <DriverGroupBar key={group.group} group={group} maxAbs={maxAbs} />
      ))}
    </div>
  );
}

function DriverGroupBar({
  group,
  maxAbs,
}: {
  group: BarGroup;
  maxAbs: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isUp = group.shap > 0;
  const pct = maxAbs > 0 ? (Math.abs(group.shap) / maxAbs) * 45 : 0;
  const hasItems = group.items && group.items.length > 0;

  return (
    <div
      className="grid grid-cols-[150px_1fr_60px] items-center gap-3 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label */}
      <div className="text-[12.5px] font-semibold text-right text-[var(--ink)] leading-tight overflow-hidden">
        <div className="truncate">{group.group}</div>
        <div className="text-[10px] text-[var(--muted)] font-normal truncate">
          {group.top_value_summary}
        </div>
      </div>

      {/* Bar track */}
      <div
        className="relative h-[22px] rounded-md"
        style={{
          background:
            "linear-gradient(90deg, transparent calc(50% - 0.5px), var(--line) calc(50% - 0.5px), var(--line) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
        }}
      >
        <div
          className={cn(
            "absolute top-1 h-[14px] rounded",
            isUp ? "left-1/2 bg-[var(--up)]" : "right-1/2 bg-[var(--down)]"
          )}
          style={{ width: `${pct}%`, minWidth: 2 }}
        />
      </div>

      {/* Value */}
      <div
        className={cn(
          "text-[13px] font-extrabold tabular-nums text-left",
          isUp ? "text-[var(--up)]" : "text-[var(--down)]"
        )}
      >
        {isUp ? "+" : ""}${group.shap.toFixed(2)}
      </div>

      {/* Tooltip */}
      {hasItems && hovered && (
        <div className="absolute left-[140px] top-1/2 -translate-y-1/2 z-50 bg-white border border-[var(--line)] rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] px-3 py-2.5 min-w-[160px] pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {group.items!.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <span className="text-[11.5px] text-[var(--ink)]">{item.label}</span>
                <span
                  className={cn(
                    "text-[11.5px] font-semibold tabular-nums flex-shrink-0",
                    item.delta > 0
                      ? "text-[var(--up)]"
                      : item.delta < 0
                      ? "text-[var(--down)]"
                      : "text-[var(--muted)]"
                  )}
                >
                  {item.delta > 0 ? "+" : item.delta < 0 ? "−" : ""}
                  ${Math.abs(item.delta).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
