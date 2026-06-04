"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Loader2, RotateCcw, Zap, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { usePredict } from "@/hooks/usePredict";
import { cn } from "@/lib/utils";
import {
  DropZone,
  ImagePreview,
  GraphicsToggle,
  TopNInput,
  TOPN_DEFAULT,
  type StagedFile,
} from "./UploadControls";

export function SetupCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [staged, setStaged] = useState<StagedFile | null>(null);
  const [topN, setTopN] = useState(TOPN_DEFAULT);
  const [lastFileName, setLastFileName] = useState<string | null>(null);

  const {
    rdNumber,
    setRdNumber,
    setUseFabric,
    styleRecord,
    reset,
    isGraphics,
    setIsGraphics,
    sketchDataUrl,
    normalizedImageDataUrl,
  } = useAppStore();
  const predict = usePredict();

  const hasResult = !!styleRecord;
  const [open, setOpen] = useState(!hasResult);

  useEffect(() => {
    if (hasResult) {
      const id = setTimeout(() => setOpen(false), 0);
      return () => clearTimeout(id);
    }
  }, [hasResult]);

  const clearStaged = useCallback(() => setStaged(null), []);

  const stageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLastFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStaged({ file, dataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) stageFile(file);
    },
    [stageFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stageFile(file);
    e.target.value = "";
  };

  const handleEstimate = () => {
    if (!staged) return;
    const rd = rdNumber.trim() || null;
    setUseFabric(!!rd);
    predict.mutate({ imageDataUrl: staged.dataUrl, rdNumber: rd, topN, file: staged.file });
    setStaged(null);
  };

  const handleReset = () => {
    reset();
    setStaged(null);
    setLastFileName(null);
    setIsGraphics(false);
    setTopN(TOPN_DEFAULT);
    setOpen(true);
  };

  // ── Collapsed summary bar ─────────────────────────────────────────────────
  if (hasResult && !open) {
    return (
      <div
        className="flex items-center gap-3 bg-white border border-[var(--line)] rounded-[14px] shadow-[var(--shadow)] px-4 py-3 mb-[22px] cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        {/* Thumbnail — normalised when available, original otherwise */}
        {(normalizedImageDataUrl ?? sketchDataUrl) && (
          <div
            className="w-9 h-9 rounded-[8px] border flex-shrink-0 overflow-hidden flex items-center justify-center p-1"
            style={
              normalizedImageDataUrl
                ? { background: "linear-gradient(145deg, #f0f6ff 0%, #e0edff 100%)", borderColor: "#b8d1f8" }
                : { background: "#f8f9fc", borderColor: "var(--line)" }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizedImageDataUrl ?? sketchDataUrl ?? undefined}
              alt="sketch"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Info pills */}
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
          {lastFileName && (
            <span className="flex items-center gap-1 text-[11.5px] text-[var(--ink)] font-medium truncate max-w-[160px]">
              <ImageIcon size={11} className="text-[var(--muted)] flex-shrink-0" />
              {lastFileName}
            </span>
          )}
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              rdNumber.trim()
                ? "bg-[#eef6ee] border-[#c4e0c7] text-[#1b4d1f]"
                : "bg-[var(--chip)] border-[var(--line)] text-[var(--muted)]"
            )}
          >
            {rdNumber.trim() ? `RD ${rdNumber.trim()}` : "No RD"}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-[var(--chip)] border-[var(--line)] text-[var(--muted)]">
            Top {topN}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-[var(--chip)] border-[var(--line)] text-[var(--muted)]">
            {isGraphics ? "Graphic" : "Non-graphic"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--primary)] flex-shrink-0 group-hover:underline">
          New estimate
          <ChevronDown size={14} />
        </div>
      </div>
    );
  }

  // ── Full form ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-[var(--line)] rounded-[var(--radius)] shadow-[var(--shadow)] p-5 mb-[22px]">
      {hasResult && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--line)]">
          <span className="text-[13px] font-semibold text-[var(--ink)]">New estimate</span>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-[12px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            <ChevronUp size={14} />
            Hide
          </button>
        </div>
      )}

      <div className="flex gap-5 flex-wrap items-stretch">
        {/* Left: drop-zone or staged image preview */}
        <div className="flex-1 min-w-[200px]">
          {staged ? (
            <ImagePreview staged={staged} onClear={clearStaged} />
          ) : (
            <DropZone
              dragging={dragging}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              inputRef={inputRef}
              onInputChange={onInputChange}
            />
          )}
        </div>

        {/* Right: inputs + actions */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-3 justify-between">
          {/* RD number */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.4px] text-[var(--muted)] mb-[5px]">
              Fabric ID <span className="font-medium normal-case tracking-normal">(optional)</span>
            </div>
            <input
              type="text"
              value={rdNumber}
              onChange={(e) => setRdNumber(e.target.value)}
              placeholder="e.g. RD1234567"
              autoComplete="off"
              className="w-full text-[12.5px] px-[10px] py-2 border border-[var(--line)] rounded-[9px] bg-white text-[var(--ink)] focus:border-[var(--primary)] focus:shadow-[var(--ring)] outline-none transition-all"
            />
            <div className="text-[10.5px] text-[var(--muted)] mt-[4px] leading-[1.4]">
              Without an RD, fabric composition is not included.
            </div>
          </div>

          <GraphicsToggle isGraphics={isGraphics} onChange={setIsGraphics} />
          <TopNInput value={topN} onChange={setTopN} />

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end">
            {(!!styleRecord || !!staged) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-[8px] rounded-[9px] text-[12.5px] font-medium text-[var(--muted)] border border-[var(--line)] bg-white hover:border-[var(--navy)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
            {staged && (
              <button
                onClick={handleEstimate}
                disabled={predict.isPending}
                className="flex items-center gap-1.5 px-5 py-[8px] rounded-[9px] text-[12.5px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-700)] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {predict.isPending ? (
                  <><Loader2 size={13} className="animate-spin" />Estimating…</>
                ) : (
                  <><Zap size={13} />Estimate</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {predict.isError && (
        <div className="mt-3 text-[12px] text-[var(--up)] bg-[#fdeaed] border border-[#f9c0cc] rounded-[9px] px-3 py-2">
          Prediction failed — please try again.
        </div>
      )}
    </div>
  );
}
