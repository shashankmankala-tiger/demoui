"use client";

import { Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { sketchUrl } from "@/config/app.config";
import { cn } from "@/lib/utils";
import type { AnalyzeStep } from "@/types/app.types";

const BLUE      = "#1669E7";
const BLUE_SOFT = "#e8f0fd";
const GREEN     = "#16a34a";

interface StepDef {
  key: AnalyzeStep;
  label: string;
  sub: string;
}

const STEP_DEFS: Record<string, StepDef> = {
  uploading:   { key: "uploading",   label: "Reading sketch",               sub: "Decoding and preparing the image"             },
  classifying: { key: "classifying", label: "Extracting attributes",        sub: "Gemini identifies silhouette, neckline…"      },
  fabric:      { key: "fabric",      label: "Looking up fabric composition", sub: "Fetching mill data from the RD record"        },
  extracting:  { key: "extracting",  label: "Classifying garment",          sub: "Predicting department, class & subclass"      },
  costing:     { key: "costing",     label: "Estimating first cost",        sub: "CatBoost cost model · FashionCLIP similarity" },
  normalizing: { key: "normalizing", label: "Normalising sketch",           sub: "Gemini generates a clean B&W line drawing"    },
};

const STEP_ORDER_WITH_RD:    AnalyzeStep[] = ["uploading", "classifying", "fabric", "extracting", "costing", "normalizing", "done"];
const STEP_ORDER_WITHOUT_RD: AnalyzeStep[] = ["uploading", "classifying", "extracting", "costing", "normalizing", "done"];

interface AnalyzingStateProps {
  isGraphics: boolean;
}

export function AnalyzingState({ isGraphics: _isGraphics }: AnalyzingStateProps) {
  const { analyzeStep, sketchDataUrl, styleRecord, rdNumber } = useAppStore();

  const hasRd  = rdNumber.trim().length > 0;
  const order  = hasRd ? STEP_ORDER_WITH_RD : STEP_ORDER_WITHOUT_RD;
  const steps  = order.filter((k) => k !== "done").map((k) => STEP_DEFS[k]);

  const currentIdx = order.indexOf(analyzeStep);
  const imgSrc     = sketchDataUrl ?? (styleRecord ? sketchUrl(styleRecord.style_number) : null);

  return (
    <>
      <style>{`
        @keyframes scan {
          0%   { top: -10%; }
          50%  { top: 85%;  }
          100% { top: -10%; }
        }
        @keyframes snakeRotate {
          to { transform: rotate(360deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/*
        Snake-border technique:
        · Outer div has padding:2px — this 2px gap is the visible "border"
        · An overflow-hidden layer clips a rotating conic-gradient to the rounded rect
        · The conic gradient has one bright segment (head) fading to transparent (tail)
        · The white card beneath it is the content — sits above the gradient via z-index
      */}
      <div className="mt-6 relative" style={{ padding: 2 }}>

        {/* ── Rotating snake border ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 21, overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              width: "200%",
              height: "200%",
              top: "-50%",
              left: "-50%",
              /* Head: solid #1669E7 → fades transparent over ~70°. Rest is invisible. */
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 288deg, rgba(22,105,231,0) 298deg, rgba(22,105,231,0.55) 330deg, #1669E7 360deg)",
              animation: "snakeRotate 2.2s linear infinite",
            }}
          />
        </div>

        {/* ── White card (sits on top of gradient) ── */}
        <div
          className="relative bg-white overflow-hidden"
          style={{
            borderRadius: 19,
            boxShadow: "0 2px 16px rgba(22,105,231,.07), 0 1px 3px rgba(0,0,0,.05)",
            zIndex: 1,
          }}
        >
          <div className="flex gap-0 max-[640px]:flex-col">

            {/* ── Left: sketch with scan beam ── */}
            <div
              className="flex-shrink-0 flex items-center justify-center p-7 max-[640px]:pb-0"
              style={{ minWidth: 260 }}
            >
              <div
                className="relative rounded-[16px] border bg-[#f0f5ff] overflow-hidden grid place-items-center"
                style={{
                  width: 210,
                  height: 210,
                  borderColor: "#c5d9f8",
                  boxShadow: `inset 0 0 0 1px rgba(22,105,231,.1), 0 0 0 5px ${BLUE_SOFT}`,
                }}
              >
                {imgSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc} alt="Analyzing sketch" className="w-full h-full object-contain p-3" />
                ) : (
                  <span className="w-14 h-14 rounded-xl opacity-40" style={{ background: BLUE_SOFT }} />
                )}
                {/* Scan beam */}
                <span
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    height: 44,
                    background: `linear-gradient(180deg, transparent 0%, rgba(22,105,231,.26) 50%, transparent 100%)`,
                    filter: "blur(2px)",
                    animation: "scan 1.5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-[var(--line)] my-5 max-[640px]:hidden" />

            {/* ── Right: heading + step list ── */}
            <div className="flex-1 min-w-0 px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[15px] font-bold leading-none text-[var(--ink)]"
                  style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
                >
                  Estimating first cost
                </span>
              </div>

              <div className="flex flex-col gap-[2px]">
                {steps.map((step) => {
                  const idx       = order.indexOf(step.key);
                  const isDone    = currentIdx > idx;
                  const isRunning = currentIdx === idx;
                  const isPending = currentIdx < idx;

                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "flex items-center gap-3 h-[52px] px-3 rounded-[10px] transition-all duration-300",
                        isRunning && "bg-[#eef4fd]",
                        isDone    && "opacity-50",
                        isPending && "opacity-25"
                      )}
                    >
                      {/* ✓ green for done, spinner for running, dot for pending */}
                      {isDone ? (
                        <span
                          className="w-6 h-6 rounded-full grid place-items-center flex-shrink-0"
                          style={{ background: GREEN }}
                        >
                          <Check size={12} color="white" strokeWidth={2.5} />
                        </span>
                      ) : isRunning ? (
                        <span
                          className="w-6 h-6 rounded-full border-2 border-t-transparent flex-shrink-0"
                          style={{ borderColor: BLUE, borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }}
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full border-2 border-[#dde3ee] grid place-items-center flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dde3ee]" />
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-[13px] font-semibold leading-tight truncate transition-colors duration-200",
                            isRunning ? "" : isDone ? "text-[var(--ink)]" : "text-[var(--muted)]"
                          )}
                          style={isRunning ? { color: BLUE } : {}}
                        >
                          {step.label}
                        </div>
                        <div
                          className="text-[11px] mt-[3px] leading-tight truncate opacity-70"
                          style={isRunning ? { color: BLUE } : { color: "var(--muted)" }}
                        >
                          {step.sub}
                        </div>
                      </div>

                      {isRunning && (
                        <span
                          className="flex-shrink-0 text-[10.5px] font-semibold opacity-80 animate-pulse"
                          style={{ color: BLUE }}
                        >
                          Running…
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
