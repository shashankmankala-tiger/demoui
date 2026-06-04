"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ScenarioSuggestion } from "@/types/app.types";

export function ScenarioModelerScreen() {
  const { styleRecord, metadata, department, setAttributeOverride, addFeedbackItem } =
    useAppStore();
  const { finalCost } = useCostComputation();
  const [targetCost, setTargetCost] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ScenarioSuggestion[]>([]);
  const [ran, setRan] = useState(false);
  const [optText, setOptText] = useState<string>("");

  if (!styleRecord) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <div className="text-[48px] opacity-20 mb-3">📊</div>
        <div className="text-[16px] font-semibold mb-1">No style loaded</div>
        <div className="text-[13px]">
          Upload a sketch on the Cost prediction screen first.
        </div>
      </div>
    );
  }

  function runScenario() {
    const target = parseFloat(targetCost);
    if (isNaN(target) || !finalCost) return;

    const gap = finalCost - target;
    if (gap <= 0) {
      setSuggestions([]);
      setOptText(`Already at or below $${target.toFixed(2)}.`);
      setRan(true);
      return;
    }

    const shapLookup = metadata?.shapLookup?.[department] ?? {};
    const results: ScenarioSuggestion[] = [];

    for (const driver of styleRecord!.drivers) {
      const featureLookup = shapLookup[driver.feature];
      if (!featureLookup) continue;
      for (const [altValue, altShap] of Object.entries(featureLookup.values)) {
        if (altValue === driver.value_display) continue;
        const saving = driver.shap - altShap;
        if (saving > 0) {
          results.push({
            feature: driver.feature,
            label: driver.label,
            currentValue: driver.value_display,
            suggestedValue: altValue,
            saving,
            newCost: (finalCost ?? 0) - saving,
          });
        }
      }
    }

    results.sort((a, b) => b.saving - a.saving);
    const top = results.slice(0, 5);
    setSuggestions(top);
    setOptText(top.length === 0 ? "No single attribute change found. Try a different target." : "");
    setRan(true);
  }

  function resetScenario() {
    setTargetCost("");
    setSuggestions([]);
    setOptText("");
    setRan(false);
  }

  function applyChange(suggestion: ScenarioSuggestion) {
    setAttributeOverride(suggestion.feature, suggestion.suggestedValue);
    addFeedbackItem({
      type: "simulation",
      title: `Changed ${suggestion.label}`,
      description: `"${suggestion.currentValue}" → "${suggestion.suggestedValue}" (−$${suggestion.saving.toFixed(2)})`,
    });
  }

  const target = parseFloat(targetCost);

  return (
    <div className="screen-enter">
      <h2
        className="m-0 mb-[5px] text-[27px] font-extrabold tracking-[-0.6px] leading-[1.1]"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Scenario modeler
      </h2>
      <p className="text-[14px] text-[var(--muted)] mt-0 mb-[26px] max-w-[680px] leading-[1.55]">
        Set a target first cost and we&apos;ll suggest the cheapest changes to get there.
      </p>

      <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow)] px-7 py-[26px]">
        {/* Target input row */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="text-[18px] text-[var(--muted)]">$</span>
          <input
            type="number"
            value={targetCost}
            onChange={(e) => setTargetCost(e.target.value)}
            step="0.25"
            className="w-[90px] text-[18px] font-bold px-2 py-1.5 border border-[var(--line)] rounded-[9px] text-[var(--navy)] outline-none focus:border-[var(--primary)] focus:shadow-[var(--ring)] transition-all"
          />
          <Button variant="primary" size="sm" onClick={runScenario}>
            Find cheapest changes
          </Button>
          <Button variant="ghost" size="sm" onClick={resetScenario}>
            Reset
          </Button>
        </div>

        {/* Opt result */}
        {ran && optText && (
          <div
            className={cn(
              "text-[12.5px] rounded-[9px] px-3 py-2.5 border mt-2",
              optText.startsWith("Already")
                ? "bg-[var(--accent-soft)] border-[#c4e0c7] text-[var(--accent)]"
                : "bg-[#f7f9fc] border-[var(--line)] text-[var(--muted)]"
            )}
          >
            {optText}
          </div>
        )}

        {/* Cheapest single changes */}
        <h3 className="text-[12px] uppercase tracking-[0.6px] text-[var(--muted)] mt-3.5 mb-2 font-bold">
          Cheapest single changes
        </h3>

        <div>
          {suggestions.length === 0 && !ran && (
            <div className="text-[12px] text-[var(--muted)]">
              Enter a target cost above and click &ldquo;Find cheapest changes&rdquo;.
            </div>
          )}

          {suggestions.map((sugg, i) => (
            <div
              key={`${sugg.feature}-${sugg.suggestedValue}`}
              className="flex items-center gap-2.5 py-2 border-b border-dashed border-[#eef1f6] last:border-0"
            >
              <span className="text-[11px] text-[var(--muted)] w-4 text-right flex-shrink-0">
                {i + 1}.
              </span>
              <div className="flex-1 text-[12.5px]">
                <span className="font-semibold">{sugg.label}</span>
                <span className="text-[var(--muted)] ml-1.5 text-[11px]">
                  {sugg.currentValue} →{" "}
                  <b className="text-[var(--ink)]">{sugg.suggestedValue}</b>
                </span>
              </div>
              <span className="text-[12.5px] font-bold text-[var(--down)] tabular-nums flex-shrink-0 w-14 text-right">
                −${sugg.saving.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyChange(sugg)}
                className="flex-shrink-0 gap-1"
              >
                <TrendingDown size={12} />
                Apply
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
