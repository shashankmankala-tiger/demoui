"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { SetupCard } from "@/components/screens/upload/UploadZone";
import { AnalyzingState } from "@/components/screens/upload/AnalyzingState";

export default function CostPage() {
  const { analyzeStep, isGraphics, predictionError, setPredictionError } = useAppStore();
  const router = useRouter();
  const prevStep = useRef(analyzeStep);

  // Navigate to the dedicated pages when analysis completes.
  // Uses a ref-tracked transition so an already-done state on first render
  // (e.g. user manually goes back to /) does NOT trigger a redirect.
  useEffect(() => {
    const prev = prevStep.current;
    prevStep.current = analyzeStep;

    if (prev === analyzeStep) return;

    if (analyzeStep === "normalization_preview") {
      router.push("/preview");
    } else if (analyzeStep === "done") {
      router.push("/estimate");
    }
  }, [analyzeStep, router]);

  const isAnalyzing =
    analyzeStep === "uploading" ||
    analyzeStep === "classifying" ||
    analyzeStep === "fabric" ||
    analyzeStep === "extracting" ||
    analyzeStep === "costing" ||
    analyzeStep === "normalizing";

  return (
    <div className="screen-enter">
      <h2
        className="m-0 mb-[5px] text-[27px] font-extrabold tracking-[-0.6px] leading-[1.1]"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Cost prediction &amp; explanation
      </h2>

      {/* Upload form — hidden while loading */}
      {!isAnalyzing && <SetupCard />}

      {/* Idle hint */}
      {analyzeStep === "idle" && (
        <div className="text-[13px] text-[var(--muted)] leading-[1.5] py-2">
          Upload a sketch above to see the predicted first cost and explanation.
        </div>
      )}

      {/* Loading animation */}
      {isAnalyzing && <AnalyzingState isGraphics={isGraphics} />}

      {/* Prediction error — shown immediately when API fails */}
      {predictionError && !isAnalyzing && (
        <div className="mt-4 flex items-start gap-3 bg-[#fff8f8] border border-[#fcd0d0] rounded-[14px] px-5 py-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center mt-0.5">
            <AlertTriangle size={15} className="text-[#dc2626]" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold text-[#991b1b] leading-tight">
              Prediction failed
            </div>
            <div className="text-[12.5px] text-[#b91c1c] mt-1 leading-[1.5]">
              {predictionError}
            </div>
          </div>
          <button
            onClick={() => setPredictionError(null)}
            className="flex-shrink-0 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#dc2626] hover:text-[#991b1b] transition-colors mt-0.5 cursor-pointer"
          >
            <RefreshCw size={12} />
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
