"use client";

import { useAppStore } from "@/store/useAppStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { CostDriverBars } from "./CostDriverBars";
import { cn } from "@/lib/utils";
import {
  parseCostExplanationJson,
  parseCostExplanation,
  buildNoteFromBreakdown,
  buildDeltaNote,
} from "@/lib/costExplanation";

export function CostHero() {
  const {
    styleRecord,
    predictedDept,
    locked,
    previousCost,
  } = useAppStore();
  const { finalCost } = useCostComputation();

  if (!styleRecord) return null;

  // Prefer the structured JSON explanation (new backend); fall back to string parsing (legacy).
  const groupBreakdown = styleRecord.costExplanationData
    ? parseCostExplanationJson(styleRecord.costExplanationData)
    : styleRecord.costExplanation
      ? parseCostExplanation(styleRecord.costExplanation)
      : [];

  return (
    <div className="cost-hero grid max-[760px]:grid-cols-1" style={{ gridTemplateColumns: "1fr", gap: 20, alignItems: "stretch" }}>

      {/* hero-left — cost figure */}
      <div
        className="bg-white border hidden border-[var(--line)] rounded-[18px] shadow-[var(--shadow-md)] px-8 py-[30px]"
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 100% 0%, rgba(22,105,231,.05) 0%, rgba(22,105,231,0) 44%)",
        }}
      >
        {/* Cost big */}
        <div
          className={cn(
            "text-[68px] font-semibold leading-none tabular-nums tracking-[-3px]",
            locked ? "text-[var(--accent)]" : "text-[var(--navy)]"
          )}
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          {finalCost !== null ? `$${finalCost.toFixed(2)}` : "—"}
        </div>

        {/* Previous cost comparison — shown after a re-estimation */}
        {previousCost !== null && finalCost !== null && previousCost !== finalCost && (() => {
          const delta = finalCost - previousCost;
          const isUp = delta > 0;
          return (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[12.5px] text-[var(--muted)]">
                was <span className="font-semibold text-[var(--ink)]">${previousCost.toFixed(2)}</span>
              </span>
              <span className={cn(
                "text-[12px] font-bold tabular-nums",
                isUp ? "text-[var(--up)]" : "text-[var(--down)]"
              )}>
                {isUp ? "↑" : "↓"} {isUp ? "+" : ""}${delta.toFixed(2)}
              </span>
            </div>
          );
        })()}

        {/* Confidence band — commented out until backend provides real interval
        <div className="text-[13px] text-[var(--muted)] mt-[10px]">
          confidence range{" "}
          {lowBound !== null && highBound !== null ? (
            <b className="text-[var(--ink)] font-semibold">
              ${lowBound.toFixed(2)} – ${highBound.toFixed(2)}&nbsp;&nbsp;(±{Math.round(bandPct * 100)}%)
            </b>
          ) : (
            <b className="text-[var(--ink)] font-semibold">—</b>
          )}
        </div>
        */}



        {/* LLM sketch summary — shown when present, visually distinct from the fabric note */}
        {(() => {
          const summary = typeof styleRecord.llmAttributes?.summary === "string"
            ? styleRecord.llmAttributes.summary.trim()
            : null;
          if (!summary) return null;
          return (
            <div
              className="mt-[8px] flex gap-2.5"
              style={{
                background: "#f6f8fc",
                border: "1px solid #e2e7f0",
                borderLeft: "3px solid #9db0cc",
                borderRadius: 9,
                padding: "8px 10px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                className="flex-shrink-0 mt-px"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="m-0 text-[11.5px] text-[#475569] leading-[1.5] italic">
                {summary}
              </p>
            </div>
          );
        })()}

        {/* Locked banner */}
        {locked && (
          <div
            className="flex items-center gap-2.5 mt-[18px] text-[13.5px] font-semibold rounded-[12px] px-4 py-[13px]"
            style={{
              color: "var(--accent)",
              background: "var(--accent-soft)",
              border: "1px solid #bfe6cd",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Cost locked at ${finalCost?.toFixed(2) ?? "—"}
          </div>
        )}
      </div>

      {/* hero-right — cost drivers */}
      <div className="bg-white border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-md)] px-[26px] py-6 flex flex-col">
        <h3 className="m-0 mb-1 text-[14.5px] font-bold">
          What&apos;s driving the cost?
        </h3>

        {/* Layout A — horizontal bar chart with hover tooltips */}
        {groupBreakdown.length > 0 && (
          <>
            <div className="text-[12px] text-[var(--muted)] mb-3.5 mt-1">
              How much each feature group adds to (or removes from) a typical style.
            </div>
            <CostDriverBars
              groups={groupBreakdown.map((g) => ({
                group: g.group,
                shap: g.total,
                top_value_summary: g.items.map((i) => i.label).join(", "),
                items: g.items,
              }))}
            />
            <div className="flex gap-3.5 text-[11px] text-[var(--muted)] mt-2.5">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-sm inline-block bg-[var(--down)]" />
                lowers cost
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-sm inline-block bg-[var(--up)]" />
                raises cost
              </span>
            </div>
          </>
        )}

        {/* Summary sentence — at the bottom of the driver card */}
        {(() => {
          const noteBaseline = styleRecord.costExplanationData?.category_baseline ?? styleRecord.baseline;
          const note = groupBreakdown.length > 0
            ? buildNoteFromBreakdown(finalCost, noteBaseline, predictedDept ?? styleRecord.department, groupBreakdown)
            : buildDeltaNote(finalCost, noteBaseline, predictedDept ?? styleRecord.department, styleRecord.groups);
          if (!note) return null;
          return (
            <div
              className="text-[13px] leading-[1.6] text-[var(--ink)] px-4 py-[15px] rounded-[12px]"
              style={{
                marginTop: groupBreakdown.length > 0 ? 12 : "auto",
                background: "#f5f9ff",
                borderTop: "1px solid #d0e2fb",
                borderRight: "1px solid #d0e2fb",
                borderBottom: "1px solid #d0e2fb",
                borderLeft: "3px solid var(--primary)",
              }}
            >
              {note}
            </div>
          );
        })()}

      </div>
    </div>
  );
}

