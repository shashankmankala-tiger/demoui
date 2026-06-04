"use client";

import { useRouter } from "next/navigation";
import { List, LayoutTemplate, Tag } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface OptCard {
  key: "A" | "B" | "C";
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  tab: string;
}

const OPT_CARDS: OptCard[] = [
  {
    key: "A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
    title: "A · Style attributes",
    description: "Check what the model detected and fix anything that's off.",
    href: "/feedback",
    tab: "attributes",
  },
  {
    key: "B",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="16" rx="1.5" />
      </svg>
    ),
    title: "B · Representative styles",
    description: "Tell us how similar these historical styles really are.",
    href: "/feedback",
    tab: "styles",
  },
  {
    key: "C",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20 5H9L4 12l5 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
      </svg>
    ),
    title: "C · Cost themes",
    description: "Assign positioning and the cost themes other designers flag.",
    href: "/feedback",
    tab: "themes",
  },
];

export function OptCards() {
  const router = useRouter();
  const { setActiveFeedbackTab } = useAppStore();

  function navigate(href: string, tab: string) {
    setActiveFeedbackTab(tab as "attributes" | "styles" | "themes");
    router.push(href);
  }

  return (
    <div className="adjust-band mt-[30px]">
      <div
        className="text-[16px] font-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
      >
        Want to adjust this cost?
        <small className="block text-[13px] font-normal text-[var(--muted)] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
          Pick one — review what the model assumed, compare similar styles, or add context.
        </small>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 max-[760px]:grid-cols-1">
        {OPT_CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => navigate(card.href, card.tab)}
            className="group bg-white border border-[var(--line)] rounded-[16px] p-5 text-left cursor-pointer transition-all duration-200 shadow-[var(--shadow)] hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)] relative overflow-hidden"
          >
            <span className="absolute inset-0 rounded-[16px] shadow-[inset_0_0_0_2px_transparent] group-hover:shadow-[inset_0_0_0_2px_var(--primary)] transition-all duration-200 pointer-events-none" />

            <div className="w-[42px] h-[42px] rounded-[12px] bg-gradient-to-br from-[#e8f0fd] to-[#d0e2fb] grid place-items-center mb-3.5 text-[var(--primary)]">
              {card.icon}
            </div>
            <div className="text-[15px] font-bold mb-1">{card.title}</div>
            <div className="text-[12.5px] text-[var(--muted)] leading-[1.5]">
              {card.description}
            </div>
            <div className="mt-3.5 text-[12px] font-bold text-[var(--primary)] flex items-center gap-1">
              Open →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
