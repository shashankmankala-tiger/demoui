"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAppStore } from "@/store/useAppStore";
import { useCostComputation } from "@/hooks/useCostComputation";
import { ChatMessage } from "./ChatMessage";
import { DEMO_QA } from "@/config/demoChat";

const QUICK_CHIPS = [
  "Why does this cost so much?",
  "What's the biggest cost driver?",
  "How can I reduce the cost?",
  "Is this in line with similar styles?",
];

export function ChatPanel() {
  const { closeChat, messages, addMessage, isTyping, setTyping } = useChatStore();
  const { styleRecord, department } = useAppStore();
  const { finalCost } = useCostComputation();
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Seed greeting when panel opens
  useEffect(() => {
    if (messages.length === 0 && styleRecord) {
      addMessage({
        role: "bot",
        text: `Hi! I'm your cost assistant. I can see you're working on a <b>${department}</b> with an estimated cost of <b>$${finalCost?.toFixed(2) ?? "—"}</b>. What would you like to know?`,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new messages
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    addMessage({ role: "user", text: text });
    setInput("");
    generateReply(text);
  }

  function generateReply(question: string) {
    setTyping(true);
    // Simulate AI reply — replace with real API call
    setTimeout(() => {
      setTyping(false);
      const reply = buildReply(question, styleRecord, department, finalCost);
      addMessage({ role: "bot", text: reply });
    }, 1200);
  }

  return (
    <div
      className="w-[384px] max-w-[calc(100vw-36px)] flex flex-col overflow-hidden rounded-[20px] border border-[var(--line)]"
      style={{
        maxHeight: "min(560px, calc(100vh - 120px))",
        boxShadow: "0 24px 64px rgba(17,17,26,.22)",
        background: "var(--card)",
        transformOrigin: "bottom right",
        animation: "chatIn .22s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-[15px] flex items-center gap-3"
        style={{
          background: "linear-gradient(120deg, #1057c8, #1669E7)",
          color: "#fff",
        }}
      >
        <div className="w-[34px] h-[34px] rounded-[10px] bg-white/[0.18] grid place-items-center flex-shrink-0">
          <Bot size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[14px] font-bold"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            Cost assistant
          </div>
          <div className="text-[11px] opacity-85 flex items-center gap-1.5 mt-0.5">
            <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] shadow-[0_0_0_3px_rgba(74,222,128,.3)]" />
            Online · Grounded in this estimate
          </div>
        </div>
        <button
          onClick={closeChat}
          className="border-0 bg-white/[0.16] text-white w-[30px] h-[30px] rounded-[9px] cursor-pointer text-[17px] leading-none grid place-items-center transition-colors hover:bg-white/[0.28]"
        >
          <X size={16} />
        </button>
      </div>

      {/* Chat log */}
      <div className="flex flex-col flex-1 min-h-0 p-3.5 bg-[#fbfbfd]">
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-3 pr-0.5 min-h-[120px] max-h-[320px]"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="self-start bg-white border border-[var(--line)] rounded-[14px] rounded-bl-[4px] px-3.5 py-3 flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-[6px] h-[6px] rounded-full bg-[#b9b9c6]"
                  style={{ animation: `blink 1.2s infinite ${delay}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick chips */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="text-[11.5px] px-[11px] py-1.5 rounded-full bg-[var(--primary-soft)] border border-[#e0dbff] cursor-pointer text-[var(--primary)] font-semibold transition-colors hover:bg-[#e4dfff] hover:border-[var(--primary)]"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about this estimate…"
            className="flex-1 text-[13px] px-[13px] py-[11px] border border-[var(--line)] rounded-[12px] bg-white outline-none focus:border-[var(--primary)] focus:shadow-[var(--ring)] transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="border-0 bg-[var(--primary)] text-white w-[42px] rounded-[12px] cursor-pointer grid place-items-center transition-colors hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function buildReply(
  question: string,
  styleRecord: ReturnType<typeof useAppStore.getState>["styleRecord"],
  department: string,
  finalCost: number | null
): string {
  const q = question.toLowerCase();

  // Check hardcoded Q&A first — first keyword match wins
  for (const qa of DEMO_QA) {
    if (qa.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      return qa.answer;
    }
  }

  if (!styleRecord) {
    return "Please upload a sketch first so I can give you accurate cost information.";
  }

  const topDriver = [...styleRecord.groups].sort(
    (a, b) => Math.abs(b.shap) - Math.abs(a.shap)
  )[0];

  if (q.includes("biggest") || q.includes("driver") || q.includes("main")) {
    return `The biggest cost driver for this <b>${department}</b> is <b>${topDriver?.group}</b> (<span class="amt">${topDriver?.top_value_summary}</span>), contributing <b class="amt">${topDriver?.shap > 0 ? "+" : ""}$${topDriver?.shap.toFixed(2)}</b> vs. the baseline.`;
  }

  if (q.includes("reduce") || q.includes("cheaper") || q.includes("lower")) {
    const cheapestGroup = [...styleRecord.groups]
      .filter((g) => g.shap > 0)
      .sort((a, b) => b.shap - a.shap)[0];
    if (cheapestGroup) {
      return `To reduce cost, focus on <b>${cheapestGroup.group}</b> — it's currently adding <b class="amt">+$${cheapestGroup.shap.toFixed(2)}</b>. Try the <b>Scenario modeler</b> for specific attribute change suggestions.`;
    }
    return `This style is already below baseline on most factors. Use the <b>Scenario modeler</b> to find the cheapest specific changes.`;
  }

  if (q.includes("why") || q.includes("explain")) {
    return `This <b>${department}</b> is estimated at <b class="amt">$${finalCost?.toFixed(2) ?? "—"}</b>. The baseline for this department is <b class="amt">$${styleRecord.baseline.toFixed(2)}</b>. The top driver is <b>${topDriver?.group}</b> (${topDriver?.top_value_summary}).`;
  }

  if (q.includes("similar") || q.includes("in line") || q.includes("peer")) {
    return `I don't have peer benchmarks loaded right now. Once the backend is connected, I'll be able to compare against similar styles in real time.`;
  }

  return `I can help with questions about this <b>${department}</b> estimate ($${finalCost?.toFixed(2) ?? "—"}). Try asking about cost drivers, how to reduce cost, or what's driving the estimate.`;
}
