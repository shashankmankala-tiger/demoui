"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { sketchUrl } from "@/config/app.config";
import { cn } from "@/lib/utils";
import { ImageModal } from "@/components/ui/ImageModal";

type Applicability = "high" | "medium" | "none" | null;

// Labels matching HTML: APPL=[["high","Very similar"],["medium","Somewhat"],["none","Not similar"]]
const APPL_OPTIONS: { value: Applicability; label: string; weight: number }[] = [
  { value: "high",   label: "Very similar", weight: 1.0 },
  { value: "medium", label: "Somewhat",     weight: 0.5 },
  { value: "none",   label: "Not similar",  weight: 0   },
];

export function RepresentativeStyles() {
  const { metadata, department, addFeedbackItem, sidebarCollapsed } = useAppStore();
  const { modelCost, finalCost } = useCostComputation();
  // Use sketch_id as rating key — style_number may be 0 for all real-API peers
  const [ratings, setRatings] = useState<Record<string, Applicability>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const peers = (metadata?.peerPool ?? []).filter(
    (p) => p.department === department
  );

  // Weighted avg: high=1.0, medium=0.5, none=0
  const applicablePeers = peers.filter(
    (p) => ratings[p.sketch_id] === "high" || ratings[p.sketch_id] === "medium"
  );
  const appliedCosts = applicablePeers.map((p) => p.cost);
  let weightedAvg: number | null = null;
  if (applicablePeers.length > 0) {
    let weightedSum = 0;
    let weightTotal = 0;
    for (const p of applicablePeers) {
      const w = ratings[p.sketch_id] === "high" ? 1.0 : 0.5;
      weightedSum += p.cost * w;
      weightTotal += w;
    }
    weightedAvg = weightTotal > 0 ? weightedSum / weightTotal : null;
  }
  const lo = appliedCosts.length ? Math.min(...appliedCosts) : null;
  const hi = appliedCosts.length ? Math.max(...appliedCosts) : null;
  // Blended: 70% model + 30% peer avg (mirrors HTML computeFinal logic)
  const blended =
    weightedAvg !== null && modelCost !== null
      ? modelCost * 0.7 + weightedAvg * 0.3
      : null;

  function handleRate(sketchId: string, label: string, val: Applicability) {
    setRatings((prev) => ({ ...prev, [sketchId]: val }));
    if (val !== null) {
      const lbl = { high: "very applicable", medium: "somewhat applicable", none: "not applicable" }[val];
      addFeedbackItem({
        type: "correction",
        title: "Representative style rated",
        description: `${label} → ${lbl}`,
      });
    }
  }

  return (
    <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow-md)] px-7 py-[26px]">
      <h3
        className="m-0 mb-1 text-[17px] font-bold"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Representative styles
      </h3>
      <p className="text-[13px] text-[var(--muted)] mb-5 max-w-[660px] leading-[1.55]">
        How similar is each historical style to yours? Mark each{" "}
        <b>Very</b>, <b>Somewhat</b>, or <b>Not</b> applicable — we use the
        applicable ones to sanity-check the estimate.
      </p>

      {peers.length === 0 ? (
        <div className="text-[12px] text-[var(--muted)] text-center py-8">
          No representative styles available for this department yet.
        </div>
      ) : (
        <div
          className={cn("grid gap-4", sidebarCollapsed ? "grid-cols-3" : "grid-cols-2")}
        >
          {peers.map((peer) => {
            const rating = ratings[peer.sketch_id] ?? null;
            const isHigh   = rating === "high";
            const isMedium = rating === "medium";
            const peerLabel = peer.subclass || peer.sketch_id;

            return (
              <div
                key={peer.sketch_id}
                className={cn(
                  "flex flex-col gap-3 border rounded-[16px] p-[14px] bg-white transition-all duration-150 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)]",
                  isHigh   && "border-[var(--primary)] bg-gradient-to-b from-[#f0f6ff] to-[#e0edff] shadow-[0_0_0_3px_rgba(22,105,231,.14)]",
                  isMedium && "border-[#d4ccfb]",
                  !isHigh && !isMedium && "border-[var(--line)]"
                )}
              >
                {/* Image */}
                <div
                  className="relative w-full bg-white rounded-[12px] overflow-hidden border border-[var(--line)] flex items-center justify-center cursor-pointer group/img"
                  style={{ minHeight: 200 }}
                  onClick={() => peer.image_url ? setModalImage(peer.image_url) : undefined}
                >
                  <img
                    src={peer.image_url || sketchUrl(peer.style_number)}
                    alt={`style ${peer.style_number}`}
                    className="w-full object-contain p-[10px]"
                    style={{ maxHeight: 260 }}
                    loading="lazy"
                    onError={(e) => {
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) parent.innerHTML = `<span style="font-size:28px;opacity:.2">👔</span>`;
                    }}
                  />
                  {peer.image_url && (
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-white/90 text-[11px] font-semibold text-[var(--navy)] px-3 py-1.5 rounded-full shadow text-center">
                        Click to expand
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-[11px]">
                  <div className="min-w-0">
                    {/* Title: subclass if available, else sketch_id */}
                    <div className="text-[13px] font-bold tracking-[-0.2px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {peer.subclass || peer.sketch_id}
                    </div>
                    {/* Subtitle: class + style number when available */}
                    <div className="text-[11.5px] text-[var(--muted)] mt-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {peer.class
                        ? `${peer.class} · style ${peer.style_number}`
                        : peer.style_number > 0
                        ? `style ${peer.style_number}`
                        : peer.department}
                    </div>
                    {/* Cost */}
                    <div className="inline-flex items-baseline gap-[6px] mt-[7px] text-[12px] text-[var(--muted)] whitespace-nowrap">
                      actual first cost{" "}
                      <b className="text-[16px] font-extrabold text-[var(--navy)] tabular-nums">
                        ${peer.cost.toFixed(2)}
                      </b>
                    </div>
                    {/* Similarity score badge */}
                    {peer.similarity_score > 0 && (
                      <div className="mt-[3px]">
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[var(--primary)] bg-[var(--primary-soft)] px-[7px] py-[2px] rounded-full">
                          {Math.round(peer.similarity_score * 100)}% match
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Applicability buttons */}
                  <div className="flex flex-col gap-[7px]">
                    <div className="text-[10.5px] uppercase tracking-[0.5px] text-[var(--muted)] font-bold">
                      How similar?
                    </div>
                    <div className="flex border border-[var(--line)] rounded-[11px] overflow-hidden bg-white w-full">
                      {APPL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value!}
                          onClick={() => handleRate(peer.sketch_id, peerLabel, opt.value)}
                          className={cn(
                            "flex-1 border-0 px-0 py-[9px] text-[12px] font-semibold cursor-pointer transition-colors leading-[1.2] border-l border-[var(--line)] first:border-l-0",
                            rating === opt.value
                              ? opt.value === "high"
                                ? "bg-[var(--primary)] text-white"
                                : opt.value === "medium"
                                ? "bg-[#a99bff] text-white"
                                : "bg-[#a1a1ad] text-white"
                              : "bg-white text-[var(--muted)] hover:bg-[#f3f7fd] hover:text-[var(--primary)]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ImageModal
        src={modalImage ?? ""}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />

      {/* Benchmark box — always shown */}
      <div className="mt-[10px] bg-[#f7f9fc] border border-[var(--line)] rounded-[10px] px-3 py-[11px]">
        <div className="flex justify-between text-[12.5px] py-[3px]">
          <span>Model estimate</span>
          <b className="tabular-nums">{modelCost !== null ? `$${modelCost.toFixed(2)}` : "—"}</b>
        </div>
        {applicablePeers.length > 0 && weightedAvg !== null && lo !== null && hi !== null ? (
          <>
            <div className="flex justify-between text-[12.5px] py-[3px]">
              <span>{applicablePeers.length} applicable · weighted avg actual</span>
              <b className="tabular-nums">${weightedAvg.toFixed(2)}</b>
            </div>
            <div className="flex justify-between text-[12.5px] py-[3px]">
              <span>their range</span>
              <b className="tabular-nums">${lo.toFixed(2)} – ${hi.toFixed(2)}</b>
            </div>
            <div
              className="flex justify-between text-[12.5px] py-[6px] mt-1"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <span>blended first cost</span>
              <b className="tabular-nums">{blended !== null ? `$${blended.toFixed(2)}` : "—"}</b>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-[12.5px] py-[3px]">
            <span className="text-[var(--muted)]">Mark a style as applicable to sanity-check…</span>
            <b />
          </div>
        )}
      </div>
    </div>
  );
}
