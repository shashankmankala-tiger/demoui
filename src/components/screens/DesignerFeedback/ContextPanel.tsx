"use client";

import { Bot } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";

const POSITIONING_OPTIONS = [
  { value: "budget", label: "Budget" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

export function ContextPanel() {
  const { freeText, setFreeText, positioning, setPositioning, addFeedbackItem } =
    useAppStore();

  function handleSubmitContext() {
    if (!freeText.trim()) return;
    addFeedbackItem({
      type: "context",
      title: "Context note added",
      description: freeText,
    });
  }

  return (
    <div className="bg-white border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-md)] p-7">
      <h3
        className="m-0 mb-1 text-[17px] font-bold"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Context &amp; notes
      </h3>
      <p className="text-[13px] text-[var(--muted)] mb-5 max-w-[660px] leading-[1.55]">
        Add free-form context that helps the model understand this style better.
      </p>

      {/* Positioning */}
      <div className="mb-5">
        <div className="text-[11.5px] text-[var(--muted)] font-semibold mb-1.5">
          Market positioning
        </div>
        <div className="flex border border-[var(--line)] rounded-[9px] overflow-hidden w-fit">
          {POSITIONING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPositioning(value as "budget" | "standard" | "premium")}
              className={`flex-1 border-0 px-5 py-2 text-[12px] cursor-pointer transition-colors ${
                positioning === value
                  ? "bg-[var(--navy)] text-white font-semibold"
                  : "bg-white text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Free text */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[11.5px] text-[var(--muted)] font-semibold">
            Notes for model retraining
          </label>
          <span className="text-[10.5px] text-[var(--muted)]">
            {freeText.length}/500
          </span>
        </div>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="e.g. Heavy front embellishment, premium trims, targeted for holiday season…"
          className="w-full text-[12.5px] px-[10px] py-2 border border-[var(--line)] rounded-[9px] bg-white text-[var(--ink)] resize-y outline-none focus:border-[var(--primary)] focus:shadow-[var(--ring)] transition-all"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <Button variant="primary" onClick={handleSubmitContext} size="md">
          Save context
        </Button>
      </div>

      {/* AI assistant coming soon */}
      <div className="flex items-center gap-2.5 mt-6 px-[18px] py-3.5 border border-dashed border-[#d7deea] rounded-[14px] text-[var(--muted)] text-[13px] bg-[#fbfcfe]">
        <Bot size={18} className="flex-shrink-0 text-[var(--primary)]" />
        <span>Ask the cost assistant for suggestions</span>
        <span className="ml-auto text-[9.5px] uppercase tracking-[0.6px] font-bold text-[var(--primary)] bg-[#e8f0fd] px-2 py-1 rounded-lg flex-shrink-0">
          Soon
        </span>
      </div>
    </div>
  );
}
