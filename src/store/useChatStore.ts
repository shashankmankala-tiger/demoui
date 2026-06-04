"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/types/app.types";

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;

  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),

  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),
}));
