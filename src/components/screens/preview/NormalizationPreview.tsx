"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, ZoomIn, ImageOff, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ImageModal } from "@/components/ui/ImageModal";

interface NormalizationPreviewProps {
  onProceed: () => void;
}

export function NormalizationPreview({ onProceed }: NormalizationPreviewProps) {
  const { sketchDataUrl, normalizedImageDataUrl, normalizationError } = useAppStore();
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  const hasNormalised = !!normalizedImageDataUrl;
  const hasFailed = !hasNormalised && !!normalizationError;

  return (
    <>
      <div
        className="mt-6 bg-white border border-[var(--line)] rounded-[22px] overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(22,105,231,.09), 0 1px 4px rgba(0,0,0,.06)" }}
      >
        {/* Header — same visual language for both success and error */}
        <div
          className="px-7 pt-6 pb-5 flex items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #f0f6ff 0%, #e5f0ff 100%)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #1057c8 0%, #1669E7 100%)",
                boxShadow: "0 2px 8px rgba(22,105,231,.32)",
              }}
            >
              <Sparkles size={16} className="text-white" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[16px] font-bold leading-tight"
                  style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
                >
                  Sketch normalisation
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--muted)] mt-[3px] leading-[1.4] m-0">
                {hasFailed
                  ? "Normalisation unavailable for this sketch — cost prediction completed successfully."
                  : "A clean B&W line drawing was generated from your sketch."}
              </p>
            </div>
          </div>

          <button
            onClick={onProceed}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1057c8 0%, #1669E7 100%)",
              boxShadow: "0 2px 10px rgba(22,105,231,.38)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View cost estimate
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Before / after panels */}
        <div className="grid grid-cols-2 divide-x divide-[var(--line)]">

          {/* Original */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c4c9d4] flex-shrink-0" />
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.6px]">
                Original sketch
              </span>
            </div>
            <div
              className="flex-1 rounded-[16px] border border-[var(--line)] bg-[#f8f9fc] overflow-hidden flex items-center justify-center relative group cursor-zoom-in"
              style={{ minHeight: 280 }}
              onClick={() => sketchDataUrl && setModalSrc(sketchDataUrl)}
            >
              {sketchDataUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sketchDataUrl}
                    alt="Original sketch"
                    className="w-full h-full object-contain p-5"
                    style={{ maxHeight: 340 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/05 transition-colors rounded-[16px]">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm border border-[var(--line)] rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                      <ZoomIn size={12} className="text-[var(--muted)]" />
                      <span className="text-[11px] text-[var(--muted)] font-medium">Click to expand</span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-[13px] text-[var(--muted)]">No image</span>
              )}
            </div>
          </div>

          {/* Normalised — or polished empty state on error */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              {hasNormalised ? (
                <CheckCircle2 size={13} className="text-[var(--primary)] flex-shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4c9d4] flex-shrink-0" />
              )}
              <span className={`text-[11px] font-bold uppercase tracking-[0.6px] ${hasNormalised ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}>
                {hasNormalised ? "Normalised sketch" : "Normalised sketch"}
              </span>
            </div>

            <div
              className={`flex-1 rounded-[16px] border border-[var(--line)] overflow-hidden flex items-center justify-center relative group ${hasNormalised ? "cursor-zoom-in" : ""}`}
              style={{
                minHeight: 280,
                background: hasNormalised
                  ? "linear-gradient(145deg, #f0f6ff 0%, #e5f0ff 100%)"
                  : "#f8f9fc",
                borderColor: hasNormalised ? "#d8d2ff" : "var(--line)",
              }}
              onClick={() => hasNormalised && normalizedImageDataUrl && setModalSrc(normalizedImageDataUrl)}
            >
              {hasNormalised ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={normalizedImageDataUrl!}
                    alt="Normalised sketch"
                    className="w-full h-full object-contain p-5"
                    style={{ maxHeight: 340 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/05 transition-colors rounded-[16px]">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm border border-[var(--line)] rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                      <ZoomIn size={12} className="text-[var(--muted)]" />
                      <span className="text-[11px] text-[var(--muted)] font-medium">Click to expand</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Polished empty state — no amber, no warning triangle */
                <div className="flex flex-col items-center gap-4 px-8 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "#eef0f5", border: "1px solid #e2e5ee" }}
                  >
                    <ImageOff size={22} className="text-[#9ba3b5]" />
                  </div>
                  <div>
                    <div
                      className="text-[13.5px] font-semibold text-[var(--ink)] leading-tight"
                      style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
                    >
                      Not generated
                    </div>
                    <div className="text-[12px] text-[var(--muted)] mt-1 leading-[1.5]">
                      Gemini could not produce a normalised version of this sketch.
                    </div>
                  </div>
                  {normalizationError && (
                    <div className="flex items-start gap-2 bg-white border border-[#e2e5ee] rounded-[10px] px-3 py-2.5 text-left w-full">
                      <Info size={12} className="text-[#9ba3b5] flex-shrink-0 mt-[1px]" />
                      <span className="text-[10.5px] text-[var(--muted)] leading-[1.45] font-mono break-all">
                        {normalizationError}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-7 py-3.5 flex items-center gap-6"
          style={{ borderTop: "1px solid var(--line)", background: "#fdfcff" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c4c9d4]" />
            <span className="text-[11.5px] text-[var(--muted)] font-medium">Original</span>
          </div>
          {hasNormalised && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span className="text-[11.5px] text-[var(--primary)] font-medium">Normalised · Gemini</span>
            </div>
          )}
          {hasNormalised && (
            <div className="text-[11px] text-[var(--muted)] ml-2">
              Click an image to expand
            </div>
          )}
          {hasFailed && (
            <div className="text-[11px] text-[var(--muted)]">
              Click the original to expand · Cost prediction is ready
            </div>
          )}
        </div>
      </div>

      <ImageModal
        src={modalSrc ?? ""}
        isOpen={!!modalSrc}
        onClose={() => setModalSrc(null)}
      />
    </>
  );
}
