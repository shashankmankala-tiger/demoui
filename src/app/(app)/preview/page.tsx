"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { NormalizationPreview } from "@/components/screens/preview/NormalizationPreview";

export default function PreviewPage() {
  const { analyzeStep, normalizedImageDataUrl, confirmNormalizationPreview } = useAppStore();
  const router = useRouter();

  // Guard: if there's no preview data (e.g. direct URL or refresh), go back to upload.
  useEffect(() => {
    if (analyzeStep !== "normalization_preview" && !normalizedImageDataUrl) {
      router.replace("/");
    }
  }, [analyzeStep, normalizedImageDataUrl, router]);

  function handleProceed() {
    confirmNormalizationPreview();
    router.push("/estimate");
  }

  if (analyzeStep !== "normalization_preview" && !normalizedImageDataUrl) {
    return null;
  }

  return (
    <div className="screen-enter">
      <h2
        className="m-0 mb-[5px] text-[27px] font-extrabold tracking-[-0.6px] leading-[1.1]"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Sketch normalisation
      </h2>
      <NormalizationPreview onProceed={handleProceed} />
    </div>
  );
}
