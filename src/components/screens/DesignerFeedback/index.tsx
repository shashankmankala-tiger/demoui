"use client";

import { useAppStore } from "@/store/useAppStore";
import { AttributesPanel } from "./AttributesPanel";
import { RepresentativeStyles } from "./RepresentativeStyles";
import { CostThemes } from "./CostThemes";
import { FeedbackLog } from "./FeedbackLog";
import { cn } from "@/lib/utils";
import type { FeedbackTab } from "@/types/app.types";

// 3 tabs only — matching the HTML prototype exactly
const TABS: { id: FeedbackTab; label: string; icon: string }[] = [
  { id: "attributes", label: "Style attributes", icon: "A" },
  { id: "styles", label: "Representative styles", icon: "B" },
  { id: "themes", label: "Cost themes", icon: "C" },
];

export function DesignerFeedbackScreen() {
  const { styleRecord, activeFeedbackTab, setActiveFeedbackTab } = useAppStore();

  if (!styleRecord) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <div className="text-[48px] opacity-20 mb-3">🎨</div>
        <div className="text-[16px] font-semibold mb-1">No style loaded</div>
        <div className="text-[13px]">
          Upload a sketch on the Cost prediction screen first.
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter">
      <h2
        className="m-0 mb-[5px] text-[27px] font-extrabold tracking-[-0.6px] leading-[1.1]"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Designer feedback
      </h2>
      <p className="text-[14px] text-[var(--muted)] mt-0 mb-[26px] max-w-[680px] leading-[1.55]">
        Help the model get it right. Each change updates the cost live — then lock it in from the top bar.
      </p>

      {/* Sub-tabs — A / B / C */}
      <div className="inline-flex gap-1 mb-6 flex-wrap bg-[#eef1f7] p-[5px] rounded-[13px]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFeedbackTab(tab.id)}
            className={cn(
              "border-0 rounded-[9px] px-[15px] py-[9px] cursor-pointer flex items-center gap-2.5 text-[13px] font-semibold transition-all duration-150",
              activeFeedbackTab === tab.id
                ? "bg-white text-[var(--primary)] shadow-[var(--shadow)]"
                : "bg-transparent text-[var(--muted)] hover:text-[var(--primary)]"
            )}
          >
            <span
              className={cn(
                "w-[21px] h-[21px] rounded-[7px] grid place-items-center text-[11.5px] font-bold transition-colors",
                activeFeedbackTab === tab.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[#e8f0fd] text-[var(--primary)]"
              )}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeFeedbackTab === "attributes" && <AttributesPanel />}
      {activeFeedbackTab === "styles" && <RepresentativeStyles />}
      {activeFeedbackTab === "themes" && <CostThemes />}

      {/* Feedback log — always visible */}
      <FeedbackLog />
    </div>
  );
}
