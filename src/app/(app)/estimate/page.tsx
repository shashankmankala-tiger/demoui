"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Lock, Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { SetupCard } from "@/components/screens/upload/UploadZone";
import { CostHero } from "@/components/screens/estimate/CostHero";
import { OptCards } from "@/components/screens/estimate/OptCards";

export default function EstimatePage() {
  const { analyzeStep, styleRecord, locked, lockCost, rdNumber, department, addFeedbackItem } = useAppStore();
  const { openChat } = useChatStore();
  const { displayCost, finalCost } = useCostComputation();
  const router = useRouter();

  useEffect(() => {
    if (analyzeStep === "idle" || !styleRecord) {
      router.replace("/");
    }
  }, [analyzeStep, styleRecord, router]);

  if (!styleRecord) return null;

  function handleLock() {
    lockCost();
    const rd = rdNumber ? ` · RD ${rdNumber}` : "";
    addFeedbackItem({
      type: "input",
      title: "Cost locked",
      description: `${displayCost} locked for style ${styleRecord?.style_number} · ${department}${rd}`,
    });
  }

  return (
    <div className="screen-enter">

      {/* Page header row */}
      <div className="flex items-start justify-between gap-4 mb-[26px]">
        <div className="min-w-0">
          <h2
            className="m-0 mb-[5px] text-[27px] font-extrabold tracking-[-0.6px] leading-[1.1]"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            Cost prediction &amp; explanation
          </h2>
          <p className="text-[14px] text-[var(--muted)] m-0 max-w-[600px] leading-[1.55]">
            First-cost estimate with a breakdown of what&apos;s driving it.
          </p>
        </div>

        {/* Lock Cost — right side of header */}
        <div className="flex-shrink-0 mt-1">
          {!locked ? (
            <button
              onClick={handleLock}
              className="flex items-center gap-2 px-[16px] py-[9px] rounded-[10px] text-[13px] font-semibold text-white cursor-pointer border-0 whitespace-nowrap transition-all hover:brightness-105 hover:-translate-y-px"
              style={{
                background: "var(--accent)",
                boxShadow: "0 1px 2px rgba(22,163,74,.3), 0 4px 12px rgba(22,163,74,.22)",
              }}
            >
              <Lock size={14} />
              Lock Cost
            </button>
          ) : (
            <div
              className="flex items-center gap-2 px-[16px] py-[9px] rounded-[10px] text-[13px] font-semibold text-white/90 whitespace-nowrap"
              style={{ background: "var(--accent)" }}
            >
              <Check size={14} />
              {finalCost !== null ? `$${finalCost.toFixed(2)} locked` : "Locked"}
            </div>
          )}
        </div>
      </div>

      {/* Form accordion */}
      <SetupCard />

      <CostHero />
      <OptCards />

      {/* Ask AI nudge */}
      <div
        onClick={openChat}
        className="flex items-center gap-2.5 mt-[26px] px-[18px] py-3.5 border border-dashed border-[#c5d9f8] rounded-[14px] text-[var(--muted)] text-[13px] bg-[#f5f9ff] cursor-pointer hover:border-[var(--primary)] hover:text-[var(--ink)] transition-colors"
      >
        <MessageSquare size={18} className="text-[var(--primary)] flex-shrink-0" />
        Have a question about this estimate? Ask the cost assistant — it explains drivers, compares styles, and runs what-ifs.
        <span
          className="ml-auto text-[9.5px] uppercase tracking-[0.6px] font-bold px-[9px] py-1 rounded-lg flex-shrink-0 whitespace-nowrap"
          style={{ color: "#1669E7", background: "#e8f0fd" }}
        >
          Ask AI
        </span>
      </div>
    </div>
  );
}
