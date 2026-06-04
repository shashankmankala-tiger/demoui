"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { THEMES, POSITIONING } from "@/config/themes.config";
import { useCostComputation } from "@/hooks/useCostComputation";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { cn } from "@/lib/utils";
import type { Positioning } from "@/types/app.types";

const POSITIONING_OPTIONS: { value: Positioning; label: string }[] = [
  { value: "budget", label: "Budget / value product" },
  { value: "standard", label: "Core product" },
  { value: "premium", label: "Premium product" },
];

export function CostThemes() {
  const { selectedThemes, toggleTheme, positioning, setPositioning, addFeedbackItem, styleRecord } =
    useAppStore();
  const { finalCost } = useCostComputation();
  const baseline = styleRecord?.baseline ?? 0;

  function handleToggleTheme(id: string) {
    const theme = THEMES.find((t) => t.id === id);
    const isOn = selectedThemes.has(id);
    toggleTheme(id);
    const imp = theme ? theme.pct * baseline : 0;
    const impStr = imp >= 0 ? `+$${imp.toFixed(2)}` : `−$${Math.abs(imp).toFixed(2)}`;
    addFeedbackItem({
      type: "context",
      title: isOn ? "Cost theme removed" : "Cost theme assigned",
      description: isOn
        ? theme?.label ?? id
        : `${theme?.label ?? id} (${impStr})`,
    });
  }

  function handlePositioning(val: Positioning) {
    const prev = positioning;
    setPositioning(val);
    if (val !== "standard") {
      const lbl = POSITIONING_OPTIONS.find((o) => o.value === val)?.label ?? val;
      const imp = (POSITIONING[val] ?? 0) * baseline;
      const impStr = imp >= 0 ? `+$${imp.toFixed(2)}` : `−$${Math.abs(imp).toFixed(2)}`;
      addFeedbackItem({
        type: "context",
        title: "Product positioning",
        description: `${lbl} (${impStr})`,
      });
    }
  }
  const [customInput, setCustomInput] = useState("");

  const activeThemes = THEMES.filter((t) => selectedThemes.has(t.id));
  const themeTotal = activeThemes.reduce(
    (sum, t) => sum + (finalCost ?? 0) * t.pct,
    0
  );

  function addCustomTheme() {
    const text = customInput.trim();
    if (!text) return;
    addFeedbackItem({
      type: "context",
      title: `Custom theme: ${text}`,
      description: "Context only — no cost effect applied.",
    });
    setCustomInput("");
  }

  const tooltipContent = (
    <>
      Each theme applies a <b>typical cost effect</b> as a percent of this style&apos;s baseline cost:{" "}
      <b>impact = % × baseline</b>.
      <div className="flex justify-between gap-2.5 mt-1.5" style={{ color: "#c9c6ea" }}>
        <span>Positioning (pick one)</span><b style={{ color: "#fff" }}>−12% … +14%</b>
      </div>
      <div className="flex justify-between gap-2.5" style={{ color: "#c9c6ea" }}>
        <span>Common themes (e.g. beading)</span><b style={{ color: "#fff" }}>+5% … +10%</b>
      </div>
      <div className="flex justify-between gap-2.5" style={{ color: "#c9c6ea" }}>
        <span>Custom themes you type</span><b style={{ color: "#fff" }}>context only</b>
      </div>
      <div className="mt-2 text-[11px]" style={{ color: "#c9c6ea" }}>
        Everything assigned updates the estimate live and is saved for retraining.
      </div>
    </>
  );

  return (
    <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow-md)] px-7 py-[26px]">
      <h3
        className="m-0 mb-1 text-[17px] font-bold flex items-center"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Cost themes
        <InfoTooltip content={tooltipContent} />
      </h3>
      <p className="text-[13px] text-[var(--muted)] mb-5 max-w-[660px] leading-[1.55]">
        Assign the themes that describe this product. Each one applies its typical cost effect and shows up in the estimate — so the cost always reflects what&apos;s assigned.
      </p>

      {/* Product positioning */}
      <div
        className="text-[13.5px] font-bold mb-2"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Product positioning <small className="font-medium text-[var(--muted)]" style={{ fontFamily: "Inter, sans-serif" }}>(optional)</small>
      </div>
      <div className="flex gap-2.5 mb-4 flex-wrap">
        {POSITIONING_OPTIONS.map(({ value, label }) => {
          const imp = (POSITIONING[value] ?? 0) * baseline;
          const impStr = value !== "standard"
            ? (imp >= 0 ? `+$${imp.toFixed(2)}` : `−$${Math.abs(imp).toFixed(2)}`)
            : "";
          return (
            <button
              key={value}
              onClick={() => handlePositioning(value)}
              className={cn(
                "border rounded-[12px] px-[17px] py-[11px] text-[13px] font-semibold cursor-pointer transition-all duration-150",
                positioning === value
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-[0_6px_16px_rgba(22,105,231,.3)]"
                  : "bg-white text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)] hover:bg-[#f5f9ff]"
              )}
            >
              {label}
              {impStr && (
                <span className={cn("ml-2 text-[11px] font-bold", positioning === value ? "opacity-90" : "opacity-60")}>
                  {impStr}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Common cost themes */}
      <div
        className="text-[13.5px] font-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Common cost themes{" "}
        <small className="font-medium text-[var(--muted)]" style={{ fontFamily: "Inter, sans-serif" }}>
          — based on inputs from other designers
        </small>
      </div>
      <div className="text-[11px] text-[var(--muted)] mb-2.5 leading-[1.5]">
        Click to assign a theme to this product.
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {THEMES.map((theme) => {
          const isOn = selectedThemes.has(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => handleToggleTheme(theme.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-[11px] py-1.5 rounded-full text-[12px] border transition-all duration-150 cursor-pointer",
                isOn
                  ? "bg-[var(--chip-on)] text-white border-[var(--chip-on)]"
                  : "bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--navy)]"
              )}
            >
              {theme.label}
              <span className={cn("text-[10.5px]", isOn ? "opacity-85" : "opacity-70")}>
                {theme.hint}${Math.abs(theme.pct * baseline).toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom theme input */}
      <div className="flex gap-2.5 mt-3.5">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomTheme()}
          placeholder="Add your own theme (e.g. heavy embellishment)…"
          className="flex-1 text-[13px] px-[13px] py-[11px] border border-[var(--line)] rounded-[11px] bg-white text-[var(--ink)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-soft)] transition-all"
        />
        <button
          onClick={addCustomTheme}
          className="border border-[var(--line)] rounded-[9px] px-[9px] py-[5px] text-[11.5px] font-semibold bg-white text-[var(--navy)] cursor-pointer hover:border-[var(--navy)] transition-colors"
        >
          Add
        </button>
      </div>

      {/* Assigned to this product */}
      <div className="mt-[22px] border border-[var(--line)] rounded-[14px] overflow-hidden bg-[#fbfcfe]">
        <div
          className="flex items-center gap-2 px-4 py-3 bg-[#f4f7fb] border-b border-[var(--line)] text-[12.5px] font-bold"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Assigned to this product
          <span className="ml-auto text-[13px] font-extrabold tabular-nums">
            {themeTotal >= 0 ? "+" : ""}${themeTotal.toFixed(2)}
          </span>
        </div>
        <div className="px-4 pb-3">
          {activeThemes.length === 0 ? (
            <div className="text-[12.5px] text-[var(--muted)] text-center py-4">
              No themes assigned yet — assign one above and it&apos;ll reflect in the cost.
            </div>
          ) : (
            activeThemes.map((theme) => {
              const amt = (finalCost ?? 0) * theme.pct;
              return (
                <div
                  key={theme.id}
                  className="flex items-center gap-2.5 py-2.5 border-b border-dashed border-[var(--line-soft)] last:border-0 text-[13px]"
                >
                  <span className="flex-1 font-semibold">{theme.label}</span>
                  <span className="text-[11px] text-[var(--muted)] font-normal">
                    cost theme
                  </span>
                  <span
                    className="font-extrabold tabular-nums flex-shrink-0"
                    style={{ flex: "0 0 64px", textAlign: "right" }}
                  >
                    {amt >= 0 ? "+" : ""}${amt.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleToggleTheme(theme.id)}
                    className="flex-shrink-0 w-[22px] h-[22px] rounded-[7px] border border-[var(--line)] bg-white text-[var(--muted)] cursor-pointer grid place-items-center hover:border-[var(--up)] hover:text-[var(--up)] transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
