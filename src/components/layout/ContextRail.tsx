"use client";

import { AlertTriangle, Download, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { sketchUrl } from "@/config/app.config";
import { cn } from "@/lib/utils";

export function ContextRail() {
  const { styleRecord, locked, rdNumber, sketchDataUrl, normalizedImageDataUrl, department, estimationHistory } =
    useAppStore();
  const { finalCost } = useCostComputation();

  // Original cost = the cost before the very first re-estimation (oldest history entry)
  const originalCost = estimationHistory.length > 0
    ? estimationHistory[estimationHistory.length - 1].previousCost
    : null;

  if (!styleRecord) return null;

  const showNormalized = !!normalizedImageDataUrl;
  const imgSrc = showNormalized ? normalizedImageDataUrl! : (sketchDataUrl ?? sketchUrl(styleRecord.style_number));

  return (
    <aside className="sticky top-[84px] bg-white border border-[var(--line)] rounded-[18px] overflow-hidden shadow-[var(--shadow-md)] hidden lg:block">
      {/* Sketch image — normalised when available */}
      <div
        className="w-full h-[220px] flex items-center justify-center overflow-hidden border-b border-[var(--line)] relative"
        style={showNormalized ? { background: "linear-gradient(145deg, #f0f6ff 0%, #e5f0ff 100%)" } : { background: "#fff" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={showNormalized ? "Normalised sketch" : "Uploaded sketch"}
          className="w-full h-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {showNormalized && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[var(--primary)] text-white rounded-[7px] px-2 py-1 text-[9.5px] font-bold shadow-sm tracking-[0.3px]">
            <Sparkles size={9} />
            Normalised
          </div>
        )}
        {showNormalized && (
          <a
            href={normalizedImageDataUrl!}
            download="normalised_sketch.png"
            title="Download normalised sketch"
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[var(--line)] rounded-lg text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors shadow-sm"
          >
            <Download size={12} />
          </a>
        )}
      </div>

      {/* Dept → class → subclass hierarchy */}
      <div className="px-4 pt-3 pb-1 flex flex-col gap-[5px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-[var(--muted)] mb-0.5">
          {showNormalized ? "Normalised sketch" : "Sketch"}
        </div>
        {/* Dept → class → subclass chips */}
        <div className="flex flex-wrap gap-1.5">
          {department && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4px] px-2 py-[3px] rounded-full bg-[var(--gray-50)] border border-[var(--line)] text-[var(--gray-800)]">
              {department}
              <span className="font-normal normal-case tracking-normal opacity-60">dept</span>
            </span>
          )}
          {styleRecord.class && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4px] px-2 py-[3px] rounded-full bg-[var(--chip)] border border-[var(--line)] text-[var(--navy)]">
              {styleRecord.class}
              <span className="font-normal normal-case tracking-normal opacity-60">class</span>
            </span>
          )}
          {styleRecord.subclass && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4px] px-2 py-[3px] rounded-full bg-[var(--primary-soft)] border border-[#b8d1f8] text-[var(--primary)]">
              {styleRecord.subclass}
              <span className="font-normal normal-case tracking-normal opacity-60">subclass</span>
            </span>
          )}
        </div>
      </div>

      {/* Cost */}
      <div className="text-[11px] uppercase tracking-[0.5px] text-[var(--muted)] font-semibold px-4 pt-3">
        Working cost
        <div className="flex items-baseline gap-2 mt-0.5">
          <b
            className={cn(
              "text-[27px] font-extrabold tracking-[-1px] tabular-nums",
              locked ? "text-[var(--accent)]" : "text-[var(--navy)]"
            )}
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            {finalCost !== null ? `$${finalCost.toFixed(2)}` : "—"}
          </b>
          {originalCost !== null && finalCost !== null && originalCost !== finalCost && (
            <span className="text-[12px] font-medium text-[var(--muted)] tabular-nums line-through">
              ${originalCost.toFixed(2)}
            </span>
          )}
        </div>
      </div>


      {/* Combined mode pill */}
      <div className="mx-4 mt-3 mb-1">
        <div
          className={cn(
            "text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-center flex items-center justify-center gap-1.5",
            styleRecord.inputType === "sketch_and_rd"
              ? "bg-[#eef6ee] border-[#c4e0c7] text-[#1b4d1f]"
              : "bg-[var(--chip)] border-[var(--line)] text-[var(--muted)]"
          )}
        >
          <span>
            {styleRecord.inputType === "sketch_and_rd"
              ? `Sketch + RD (${rdNumber})`
              : "Sketch-only"}
          </span>
          {styleRecord.graphicsPipelineMode && (
            <>
              <span className="opacity-30">·</span>
              <span className={styleRecord.inputType !== "sketch_and_rd" ? "text-[var(--muted)]" : ""}>
                {styleRecord.graphicsPipelineMode === "graphics" ? "Graphic" : "Non-graphic"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Fabric / RD mode note */}
      <div
        className="mx-4 mt-2 text-[10.5px] px-3 py-2 rounded-[9px] leading-[1.45]"
        style={
          styleRecord.inputType === "sketch_and_rd"
            ? { background: "#eef6ee", border: "1px solid #c4e0c7", color: "#1b4d1f" }
            : { background: "#fff8e6", border: "1px solid #f0dfa0", color: "#6b5500" }
        }
      >
        {styleRecord.inputType === "sketch_and_rd" ? (
          <>Fabric composition from RD <b>{rdNumber}</b> is included.</>
        ) : (
          <>No RD — fabric composition is <b>not</b> used. Add an RD number to include material cost from fabric lookup.</>
        )}
      </div>

      {/* Pipeline note — info banner */}
      {styleRecord.pipelineNote ? (
        <div className="mx-4 mt-1 mb-3 flex items-start gap-1.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] px-3 py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" className="flex-shrink-0 mt-[1px]">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="text-[10.5px] text-[#1d4ed8] leading-[1.4] m-0">{styleRecord.pipelineNote}</p>
        </div>
      ) : (
        <div className="mb-3" />
      )}

      {/* Sub-step errors from the backend */}
      {(styleRecord.costError || styleRecord.similarityError || styleRecord.apiError) && (
        <div className="mx-4 mb-4 flex flex-col gap-1.5">
          {[styleRecord.costError, styleRecord.similarityError, styleRecord.apiError]
            .filter(Boolean)
            .map((err, i) => (
              <div key={i} className="flex items-start gap-1.5 bg-[#fff8f8] border border-[#fcd0d0] rounded-[10px] px-3 py-2">
                <AlertTriangle size={11} className="text-[#dc2626] flex-shrink-0 mt-[2px]" />
                <span className="text-[10.5px] text-[#991b1b] leading-[1.35]">{err}</span>
              </div>
            ))}
        </div>
      )}
    </aside>
  );
}
