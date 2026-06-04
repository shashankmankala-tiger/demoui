"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ContextRail } from "./ContextRail";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const styleRecord = useAppStore((s) => s.styleRecord);
  const pathname = usePathname();
  // Don't show the aside rail on the normalization preview page
  const hasRail = !!styleRecord && pathname !== "/preview";

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <main className="flex-1">
          <div
            className={cn(
              "px-[34px] py-[30px] pb-[70px] max-w-[1320px] w-full mx-auto",
              hasRail && "grid grid-cols-[300px_minmax(0,1fr)] gap-6 items-start lg:grid-cols-[300px_minmax(0,1fr)]"
            )}
          >
            {hasRail && <ContextRail />}

            <div className={cn("min-w-0 screen-enter", !hasRail && "col-span-full")}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
