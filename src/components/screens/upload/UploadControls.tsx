"use client";

import { Image as ImageIcon, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface StagedFile {
  file: File;
  dataUrl: string;
}

// ── Top-N bounds (shared with SetupCard) ─────────────────────────────────────

export const TOPN_MIN = 1;
export const TOPN_MAX = 20;
export const TOPN_DEFAULT = 6;

// ── DropZone ──────────────────────────────────────────────────────────────────

interface DropZoneProps {
  dragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DropZone({
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  inputRef,
  onInputChange,
}: DropZoneProps) {
  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "h-full min-h-[140px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150",
        dragging
          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
          : "border-[#cdd6e4] bg-[#fbfcfe] text-[var(--muted)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
      )}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" className="opacity-60">
        <path d="M12 16V4m0 0L7 9m5-5l5 5" />
        <path d="M5 19h14" />
      </svg>
      <div className="text-[13.5px] text-center px-4">
        <b className="text-[var(--ink)] font-semibold">Upload a sketch</b>
        <span className="block text-[11.5px] mt-0.5 opacity-70">PNG / JPG · drag &amp; drop</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
    </div>
  );
}

// ── ImagePreview ──────────────────────────────────────────────────────────────

interface ImagePreviewProps {
  staged: StagedFile;
  onClear: () => void;
}

export function ImagePreview({ staged, onClear }: ImagePreviewProps) {
  return (
    <div
      className="flex flex-col border border-[var(--line)] rounded-[12px] bg-[#f9fafc] overflow-hidden"
      style={{ minHeight: 140 }}
    >
      <div className="flex-1 flex items-center justify-center p-3 min-h-0">
        <img
          src={staged.dataUrl}
          alt={staged.file.name}
          className="max-h-[200px] max-w-full w-full object-contain"
        />
      </div>
      <div className="bg-white border-t border-[var(--line)] px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0">
        <ImageIcon size={11} className="text-[var(--muted)] flex-shrink-0" />
        <span className="text-[10.5px] text-[var(--muted)] truncate flex-1">{staged.file.name}</span>
        <button
          onClick={onClear}
          className="flex-shrink-0 w-5 h-5 rounded-full bg-[#e8eaf0] text-[var(--muted)] flex items-center justify-center hover:bg-[#d1d5e0] hover:text-[var(--ink)] transition-colors"
          aria-label="Remove image"
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
}

// ── GraphicsToggle ────────────────────────────────────────────────────────────

interface GraphicsToggleProps {
  isGraphics: boolean;
  onChange: (v: boolean) => void;
}

export function GraphicsToggle({ isGraphics, onChange }: GraphicsToggleProps) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.4px] text-[var(--muted)] mb-[5px]">
        Sketch type
      </div>
      <div className="flex rounded-[10px] border border-[var(--line)] overflow-hidden bg-[#f9fafc] p-[3px] gap-[3px]">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-[8px] text-[12px] font-semibold transition-colors duration-100 cursor-pointer",
            !isGraphics
              ? "bg-white text-[var(--navy)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[var(--line)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          )}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Non-graphic
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-[8px] text-[12px] font-semibold transition-colors duration-100 cursor-pointer",
            isGraphics
              ? "bg-white text-[var(--primary)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#b8d1f8]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          )}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="2"/>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Graphic
        </button>
      </div>
    </div>
  );
}

// ── TopNInput ─────────────────────────────────────────────────────────────────

interface TopNInputProps {
  value: number;
  onChange: (v: number) => void;
}

export function TopNInput({ value, onChange }: TopNInputProps) {
  const clamp = (n: number) => Math.min(TOPN_MAX, Math.max(TOPN_MIN, n));

  const handleRawInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) onChange(clamp(parsed));
  };

  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.4px] text-[var(--muted)] mb-[5px]">
        Similar styles
        <span className="font-medium normal-case tracking-normal ml-1">(top N)</span>
      </div>
      <div className="flex items-center gap-0 border border-[var(--line)] rounded-[9px] overflow-hidden bg-white w-fit">
        <button
          type="button"
          disabled={value <= TOPN_MIN}
          onClick={() => onChange(clamp(value - 1))}
          className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[#f3f4f8] disabled:opacity-30 transition-colors cursor-pointer"
          aria-label="Decrease"
        >
          <Minus size={12} />
        </button>
        <input
          type="number"
          min={TOPN_MIN}
          max={TOPN_MAX}
          value={value}
          onChange={handleRawInput}
          className="w-10 text-center text-[13px] font-semibold text-[var(--ink)] border-x border-[var(--line)] outline-none bg-white py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          disabled={value >= TOPN_MAX}
          onClick={() => onChange(clamp(value + 1))}
          className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[#f3f4f8] disabled:opacity-30 transition-colors cursor-pointer"
          aria-label="Increase"
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="text-[10.5px] text-[var(--muted)] mt-[4px] leading-[1.4]">
        How many similar styles to retrieve ({TOPN_MIN}–{TOPN_MAX}).
      </div>
    </div>
  );
}
