"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({ message: "", visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setState((s) => ({ ...s, visible: false }));
    }, 2200);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-6 left-1/2 z-[80] px-[18px] py-[11px] rounded-[10px] text-[13px] text-white transition-all duration-250 pointer-events-none"
        style={{
          background: "var(--navy)",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          opacity: state.visible ? 1 : 0,
          transform: `translateX(-50%) translateY(${state.visible ? 0 : 20}px)`,
        }}
      >
        {state.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
