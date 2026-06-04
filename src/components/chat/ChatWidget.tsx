"use client";

import { MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-3">
      {isOpen && <ChatPanel />}

      <button
        onClick={toggleChat}
        className="h-[50px] px-5 rounded-full border-0 text-white cursor-pointer flex items-center gap-2 text-[13.5px] font-semibold transition-all duration-150 hover:-translate-y-0.5"
        style={{
          background: "var(--primary)",
          boxShadow: "0 8px 24px rgba(22,105,231,.38)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-700)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 30px rgba(22,105,231,.46)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(22,105,231,.38)";
        }}
      >
        <MessageSquare size={18} />
        Ask AI
      </button>
    </div>
  );
}
