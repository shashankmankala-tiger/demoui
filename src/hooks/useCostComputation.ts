"use client";

import { useAppStore } from "@/store/useAppStore";

export function useCostComputation() {
  const { styleRecord, finalCost, locked } = useAppStore();

  const modelCost = styleRecord?.y_pred ?? null;
  const delta =
    finalCost !== null && modelCost !== null ? finalCost - modelCost : null;

  const formatCost = (v: number | null) =>
    v !== null ? `$${v.toFixed(2)}` : "—";

  const formatDelta = (v: number | null) => {
    if (v === null) return null;
    const sign = v >= 0 ? "+" : "";
    return `${sign}$${v.toFixed(2)}`;
  };

  return {
    finalCost,
    modelCost,
    delta,
    locked,
    formatCost,
    formatDelta,
    displayCost: formatCost(finalCost),
    displayDelta: formatDelta(delta),
    isUp: (delta ?? 0) > 0,
  };
}
