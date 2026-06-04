"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { FeedbackItem, EstimationRun } from "@/types/app.types";

const CAT_LABEL: Record<string, string> = {
  simulation: "Simulation",
  correction: "Model fix",
  context: "Context",
  event: "Event",
};

const CAT_CLASS: Record<string, string> = {
  simulation: "bg-[#fff1e8] text-[#9a4a12] border-[#f3d3bd]",
  correction: "bg-[#eaf0ff] text-[#2447b8] border-[#cdd9fb]",
  context: "bg-[#f1eeff] text-[#5b3ec8] border-[#ddd5fb]",
  event: "bg-[#eef6ee] text-[#1b4d1f] border-[#c4e0c7]",
};

const TAG_CLASS: Record<FeedbackItem["type"], string> = {
  correction: "bg-[#fdeaed] text-[#d1495b]",
  simulation: "bg-[#fdeaed] text-[#d1495b]",
  context: "bg-[#eef2f8] text-[#1f3a5f]",
  input: "bg-[#e8eef8] text-[#1f3a5f]",
};

const TAG_LABEL: Record<FeedbackItem["type"], string> = {
  correction: "vary",
  simulation: "vary",
  context: "note",
  input: "input",
};

function itemCategory(type: FeedbackItem["type"]): string {
  if (type === "simulation") return "simulation";
  if (type === "correction") return "correction";
  if (type === "context") return "context";
  return "event";
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function EstimationRunRow({ run }: { run: EstimationRun }) {
  const prev = run.previousCost;
  const next = run.newCost;
  const delta = prev !== null && next !== null ? next - prev : null;
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  const changeLabel = [
    run.deptChanged && "dept",
    run.changedAttrKeys.length > 0 && `${run.changedAttrKeys.length} attr${run.changedAttrKeys.length > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="border border-[var(--line)] rounded-[10px] px-[11px] py-[9px] mb-2 bg-[#fafbfe]">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        {/* Cost figures */}
        <div className="flex items-baseline gap-2 flex-wrap">
          {prev !== null && (
            <span className="text-[11.5px] text-[var(--muted)] line-through">
              ${prev.toFixed(2)}
            </span>
          )}
          {next !== null ? (
            <span className="text-[14px] font-bold text-[var(--navy)]">
              ${next.toFixed(2)}
            </span>
          ) : (
            <span className="text-[13px] text-red-500 font-semibold">error</span>
          )}
          {delta !== null && delta !== 0 && (
            <span
              className={cn(
                "text-[11.5px] font-bold",
                isUp ? "text-[var(--up,#d1495b)]" : isDown ? "text-[var(--down,#27ae60)]" : "text-[var(--muted)]"
              )}
            >
              {isUp ? "↑" : "↓"} {isUp ? "+" : ""}${delta.toFixed(2)}
            </span>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
          {changeLabel && (
            <span className="text-[9.5px] font-bold uppercase tracking-[0.4px] px-[7px] py-0.5 rounded-md border bg-[#eaf0ff] text-[#2447b8] border-[#cdd9fb]">
              {changeLabel}
            </span>
          )}
          <span className="text-[10px] text-[var(--muted)]">{timeAgo(run.timestamp)}</span>
        </div>
      </div>

      {/* Details row */}
      <div className="text-[11px] text-[var(--muted)] mt-1 leading-tight flex flex-wrap gap-x-3">
        <span>Dept: {run.department}</span>
        {run.changedAttrKeys.length > 0 && (
          <span>Changed: {run.changedAttrKeys.join(", ")}</span>
        )}
        {run.costError && (
          <span className="text-red-500">{run.costError}</span>
        )}
      </div>
    </div>
  );
}

export function FeedbackLog() {
  const { feedbackItems, estimationHistory } = useAppStore();

  return (
    <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow-md)] px-7 py-[26px] mt-[18px]">

      {/* Estimation history section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <h3 className="m-0 text-[17px] font-bold" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
            Estimation history
          </h3>
          <span className="ml-auto text-[11.5px] text-[var(--muted)]">
            {estimationHistory.length} run{estimationHistory.length !== 1 ? "s" : ""}
          </span>
        </div>

        {estimationHistory.length === 0 ? (
          <div className="text-[12px] text-[var(--muted)] text-center py-[14px] bg-[#f9fafc] rounded-[10px] border border-dashed border-[var(--line)]">
            No re-estimations yet. Change a department or attribute and click <strong>Re-estimate cost</strong>.
          </div>
        ) : (
          <div>
            {estimationHistory.slice(0, 10).map((run) => (
              <EstimationRunRow key={run.id} run={run} />
            ))}
            {estimationHistory.length > 10 && (
              <div className="text-[11px] text-[var(--muted)] text-center mt-1">
                + {estimationHistory.length - 10} earlier runs
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--line)] mb-5" />

      {/* Feedback corrections section */}
      <div>
        <div className="flex items-center mb-3">
          <h3 className="m-0 text-[17px] font-bold" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
            Captured feedback
          </h3>
          <span className="ml-auto text-[11.5px] text-[var(--muted)]">
            {feedbackItems.length} captured
          </span>
        </div>

        <div style={{ marginTop: 12 }}>
          {feedbackItems.length === 0 ? (
            <div className="text-[12px] text-[var(--muted)] text-center py-[14px]">
              No feedback yet. Add an RD number, edit an attribute, rate a representative style, add a cost theme, or lock the cost.
            </div>
          ) : (
            feedbackItems.slice(0, 12).map((item) => {
              const cat = itemCategory(item.type);
              return (
                <div
                  key={item.id}
                  className="border border-[var(--line)] rounded-[10px] px-[11px] py-[9px] mb-2 text-[12px] bg-[#fafbfe]"
                >
                  <div className="font-bold text-[var(--navy)] flex justify-between items-start gap-2 flex-wrap">
                    <span>{item.title}</span>
                    <span className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={cn(
                          "text-[9.5px] font-bold uppercase tracking-[0.4px] px-[7px] py-0.5 rounded-md border",
                          CAT_CLASS[cat]
                        )}
                      >
                        {CAT_LABEL[cat]}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-[7px] py-0.5 rounded-full",
                          TAG_CLASS[item.type]
                        )}
                      >
                        {TAG_LABEL[item.type]}
                      </span>
                    </span>
                  </div>
                  <div className="text-[var(--muted)] mt-0.5 leading-tight">
                    {item.description}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-[11px] text-[var(--muted)] mt-2 leading-[1.5]">
          Corrections and context are written to the{" "}
          <code className="bg-[#f0f3f8] px-[5px] py-px rounded-md">model_feedback_queue</code>{" "}
          — the raw material for the next model refresh.
        </div>
      </div>
    </div>
  );
}
