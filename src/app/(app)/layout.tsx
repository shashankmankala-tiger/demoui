"use client";

import { Shell } from "@/components/layout/Shell";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Shell>{children}</Shell>
      <ChatWidget />
    </ToastProvider>
  );
}
