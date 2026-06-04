"use client";

import { useAppStore } from "@/store/useAppStore";
import { useRepredictFeedback } from "@/hooks/useRepredictFeedback";
import { ORIGINS } from "@/config/themes.config";
import { getAttrOptions, VALID_ATTR_KEYS, ATTR_LABELS } from "@/lib/attrLabels";
import { APP_CONFIG } from "@/config/app.config";
import { cn } from "@/lib/utils";
import type { Driver, FeedbackPredictRequest } from "@/types/api.types";

/** Bullet dot colors per attribute — grouped by visual category. */
const ATTR_COLORS: Record<string, string> = {
  // Shape & fit — blue family
  silhouette:        "#6d8fff",
  length:            "#5bb8ff",
  back:              "#4ecdc4",
  neck_line_type:    "#a78bfa",
  sleeves_type:      "#818cf8",
  // Construction — amber/orange family
  panels_count:      "#f59e0b",
  pockets:           "#fb923c",
  pockets_count:     "#fbbf24",
  seam_count:        "#f97316",
  // Bottoms — green/teal family
  leg_shape:         "#34d399",
  rise:              "#2dd4bf",
  waist_type:        "#4ade80",
  skirt_construction:"#86efac",
};

function originLabel(o: { v: string; label: string; mult: number }): string {
  if (!o.mult) return o.label;
  const pct = Math.round(o.mult * 100);
  return `${o.label} (${pct > 0 ? "+" : ""}${pct}%)`;
}

export function AttributesPanel() {
  const {
    styleRecord,
    metadata,
    department,
    attributeOverrides,
    origin,
    useFabric,
    rdNumber,
    isGraphics,
    predictedDept,
    predictedConf,
    repredictError,
    setAttributeOverride,
    setDepartment,
    setOrigin,
    addFeedbackItem,
  } = useAppStore();

  const repredict = useRepredictFeedback();

  if (!styleRecord) return null;

  const isDeptDirty = department !== styleRecord.department;
  const isAttrsDirty = Object.keys(attributeOverrides).length > 0;
  const isDirty = isDeptDirty || isAttrsDirty;

  function buildRepredictRequest(): FeedbackPredictRequest {
    return {
      department,
      attributes: { ...styleRecord!.llmAttributes, ...attributeOverrides },
      rd_number: rdNumber.trim() || null,
      is_graphics: isGraphics,
      dept_changed: isDeptDirty,
      topn: 6,
      // Pass existing class/subclass so the BE can skip the classifier when
      // only attributes changed (dept_changed=false).
      current_class: styleRecord!.class,
      current_subclass: styleRecord!.subclass,
    };
  }

  // Always show the full known department list; fall back to metadata keys if available
  const metaDepts = Object.keys(metadata?.deptBaseline ?? {});
  const deptOptions = APP_CONFIG.departments.length > 0
    ? [...new Set([...APP_CONFIG.departments, ...metaDepts])]
    : metaDepts;
  const isOverriddenDept = department !== styleRecord.department;
  const confLabel = predictedConf !== null
    ? `${Math.round(predictedConf * 100)}% confidence`
    : "Predicted";

  function handleDeptChange(newDept: string) {
    const old = department;
    setDepartment(newDept);
    addFeedbackItem({ type: "correction", title: "Department override",
      description: `${old} → ${newDept} (designer confirmed)` });
  }

  function handleAttrChange(feature: string, label: string, oldVal: string, newVal: string) {
    setAttributeOverride(feature, newVal);
    addFeedbackItem({ type: "correction", title: `Corrected ${label}`,
      description: `"${oldVal}" → "${newVal}"` });
  }

  // Always show all 13 known attrs; fill in synthetic "Unknown" rows for any the
  // backend didn't return (NA for this garment type, or model didn't predict).
  const driverMap = new Map(styleRecord.drivers.map((d) => [d.feature, d]));
  const visibleDrivers: Driver[] = [...VALID_ATTR_KEYS].map((key) => {
    if (driverMap.has(key)) return driverMap.get(key)!;
    return {
      feature: key,
      label: ATTR_LABELS[key] ?? key,
      value_raw: "Unknown",
      value_display: "Unknown",
      shap: 0,
    };
  });

  const hasShapData = !!metadata?.shapLookup && Object.keys(metadata.shapLookup).length > 0;
  // Always show the cost column; values are $0.00 when SHAP data is unavailable
  const showCostCol = true;

  return (
    <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow-md)] px-7 py-[26px]">
      <h3 className="m-0 mb-1 text-[17px] font-bold"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
        Style attributes
      </h3>
      <p className="text-[13px] text-[var(--muted)] mb-[18px] max-w-[660px] leading-[1.55]">
        {useFabric
          ? "Detected from the sketch + RD. Fix anything off — the cost updates instantly."
          : "Detected from the sketch. Fix anything off — the cost updates instantly."}
      </p>

      {/* Department */}
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-[0.5px] text-[var(--muted)] font-bold mb-1.5 flex items-center gap-2">
          Department
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full normal-case",
            isOverriddenDept
              ? "bg-[var(--accent-soft)] border border-[#c4e0c7] text-[var(--accent)]"
              : "bg-[#e8eef8] border border-[#c8d3ea] text-[var(--navy)]"
          )}>
            {isOverriddenDept ? "designer override" : confLabel}
          </span>
        </div>
        <select
          value={department}
          onChange={(e) => handleDeptChange(e.target.value)}
          className={cn(
            "w-full text-[12.5px] px-[9px] py-[7px] border rounded-[8px] bg-white text-[var(--ink)] focus:border-[var(--primary)] outline-none transition-all",
            isOverriddenDept ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)]"
          )}
        >
          {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="text-[11px] text-[var(--muted)] mt-1 leading-[1.4]">
          {isOverriddenDept
            ? `Model predicted ${predictedDept ?? styleRecord.department} (${Math.round((predictedConf ?? 0.85) * 100)}%) — you changed it.`
            : "Model prediction — change only if the classifier got it wrong."}
        </div>
      </div>

      {/* Country of manufacture */}
      <div className="mt-3 pt-3 border-t border-[var(--line)]">
        <div className="text-[11px] uppercase tracking-[0.5px] text-[var(--muted)] font-bold mb-1.5">
          Country of manufacture
        </div>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className={cn(
            "w-full text-[12px] px-[9px] py-[7px] border rounded-[8px] bg-white text-[var(--ink)] outline-none transition-all",
            origin !== "unknown" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)]"
          )}
        >
          {ORIGINS.map((o) => <option key={o.v} value={o.v}>{originLabel(o)}</option>)}
        </select>
        <div className="text-[10.5px] text-[var(--muted)] mt-1 leading-[1.35]">
          Cut-and-make / labor geography
        </div>
      </div>

      {/* ── Attributes section: hidden when department was changed ── */}
      {isDeptDirty ? (
        /* Department changed → attributes no longer applicable */
        <div
          className="mt-4 rounded-[12px] overflow-hidden border border-[var(--line)]"
          style={{ background: "#f8f9fc" }}
        >
          {/* Coloured top strip */}
          <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #1669E7, #60a5fa)" }} />

          <div className="px-5 py-4 flex gap-4 items-start">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center mt-[1px]"
              style={{ background: "#e8f0fd" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1669E7" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[var(--ink)] m-0 mb-1 leading-snug">
                Attribute editing paused
              </p>
              <p className="text-[12px] text-[var(--muted)] m-0 leading-[1.55]">
                The current attributes were extracted for{" "}
                <span className="font-semibold text-[var(--ink)]">{styleRecord.department}</span>.
                Switching to{" "}
                <span className="font-semibold text-[var(--ink)]">{department}</span> requires a
                fresh extraction — re-estimating will run the full pipeline and unlock attribute
                editing for the new department.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Department unchanged → show attribute editing table */
        visibleDrivers.length > 0 && (
          <div className="mt-[18px]">
            <div className="flex items-center justify-between mb-[10px]">
              <h3 className="text-[12px] uppercase tracking-[0.6px] text-[var(--muted)] m-0 font-bold">
                Designer-specified attributes
              </h3>
              <span className="text-[10.5px] text-[var(--muted)] leading-tight">
                Gemini-detected · correct anything wrong
              </span>
            </div>

            {/* Column headers */}
            <div
              className="flex pb-[7px] border-b border-[var(--line)] mb-1 text-[10px] uppercase tracking-[0.5px] text-[var(--muted)] font-bold"
              style={{ gap: 7 }}
            >
              <div style={{ flex: "0 0 116px" }}>Attribute</div>
              <div style={{ flex: 1 }}>Value</div>
              {showCostCol && <div style={{ flex: "0 0 50px", textAlign: "right" }}>Δ cost</div>}
            </div>

            {visibleDrivers.map((driver) => {
              const isOverridden = driver.feature in attributeOverrides;
              const currentValue = isOverridden ? attributeOverrides[driver.feature] : driver.value_display;

              const isCountAttr = ["panels_count", "seam_count", "pockets_count"].includes(driver.feature);
              const yamlOpts = getAttrOptions(department, driver.feature);
              const isNaAttr = !isCountAttr && yamlOpts.length === 0;
              const allOpts = isNaAttr ? [] : [...new Set([currentValue, ...yamlOpts])];

              const shapValues = metadata?.shapLookup?.[department]?.[driver.feature]?.values;
              const delta = hasShapData && isOverridden && shapValues
                ? (shapValues[currentValue] ?? driver.shap) - driver.shap
                : 0;

              return (
                <div
                  key={driver.feature}
                  className="flex items-start py-[7px] border-b border-dashed border-[#eef1f6] last:border-0"
                  style={{ gap: 7 }}
                >
                  {/* Label with colored bullet */}
                  <div style={{ flex: "0 0 116px" }} className="min-w-0 pt-[6px] flex items-start gap-[6px]">
                    <span
                      className="flex-shrink-0 mt-[3px] w-[7px] h-[7px] rounded-full"
                      style={{ backgroundColor: ATTR_COLORS[driver.feature] ?? "#b3bbc8" }}
                    />
                    <div className="min-w-0">
                      <span className="text-[11.5px] text-[var(--muted)] block leading-[1.2]">
                        {driver.label}
                      </span>
                      {isOverridden && (
                        <span className="text-[9.5px] text-[var(--accent)] block leading-[1.15] mt-0.5">
                          was: {driver.value_display}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Value selector */}
                  {isNaAttr ? (
                    <span
                      className="min-w-0 text-[12px] text-[var(--ink)] px-[7px] py-[5px] border border-[var(--line-soft)] rounded-[8px] bg-[#f9fafc]"
                      style={{ flex: 1 }}
                    >
                      {currentValue}
                    </span>
                  ) : isCountAttr ? (
                    <input
                      type="number"
                      min={0}
                      value={currentValue}
                      onChange={(e) => handleAttrChange(driver.feature, driver.label, driver.value_display, e.target.value)}
                      className={cn(
                        "min-w-0 text-[12px] px-[7px] py-[5px] border rounded-[8px] bg-white text-[var(--ink)] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        isOverridden
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] hover:border-[var(--primary)]"
                      )}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <select
                      value={currentValue}
                      onChange={(e) => handleAttrChange(driver.feature, driver.label, driver.value_display, e.target.value)}
                      className={cn(
                        "min-w-0 text-[12px] px-[7px] py-[5px] border rounded-[8px] bg-white text-[var(--ink)] outline-none transition-all cursor-pointer",
                        isOverridden
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] hover:border-[var(--primary)]"
                      )}
                      style={{ flex: 1 }}
                    >
                      {allOpts.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}

                  {/* Δ cost */}
                  {showCostCol && (
                    <div
                      className={cn(
                        "flex-shrink-0 text-[11.5px] font-bold tabular-nums text-right pt-[6px]",
                        delta === 0 ? "text-[#b3bbc8]" : delta > 0 ? "text-[var(--up)]" : "text-[var(--down)]"
                      )}
                      style={{ flex: "0 0 50px" }}
                    >
                      {delta === 0 ? "$0.00" : `${delta > 0 ? "+" : "−"}$${Math.abs(delta).toFixed(2)}`}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Inline helper note below the table */}
            <p className="text-[10.5px] text-[var(--muted)] mt-3 leading-[1.45] m-0">
              Changing a department above will hide this section — attributes are
              department-specific and must be re-extracted after a department switch.
            </p>
          </div>
        )
      )}

      {/* Re-estimate cost button — shown when any change has been made */}
      {isDirty && (
        <div className="mt-5 pt-4 border-t border-[var(--line)]">
          {repredictError && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2 mb-3 leading-[1.4]">
              {repredictError}
            </div>
          )}
          <button
            onClick={() => repredict.mutate(buildRepredictRequest())}
            disabled={repredict.isPending}
            className={cn(
              "w-full py-[10px] px-4 rounded-[10px] text-[13px] font-semibold transition-all",
              repredict.isPending
                ? "bg-[var(--chip)] text-[var(--muted)] cursor-not-allowed"
                : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {repredict.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Estimating…
              </span>
            ) : (
              "Re-estimate cost"
            )}
          </button>
          <p className="text-[10.5px] text-[var(--muted)] mt-1.5 text-center leading-[1.35]">
            {isDeptDirty && isAttrsDirty
              ? "Re-runs classifier + cost model + similarity with your changes"
              : isDeptDirty
              ? "Re-runs classifier + cost model + similarity with new department"
              : "Re-runs cost model + similarity with corrected attributes"}
          </p>
        </div>
      )}
    </div>
  );
}
