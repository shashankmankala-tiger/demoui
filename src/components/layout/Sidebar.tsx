"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Heart,
  BarChart2,
  FileText,
  Package,
  Zap,
  // ChevronLeft, ChevronRight — re-enable when sidebar expand/collapse is restored
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { APP_CONFIG } from "@/config/app.config";
import { cn } from "@/lib/utils";

const SIDEBAR_BG = "#104AA1";
const SIDEBAR_ACTIVE = "#1669E7";

interface NavItem {
  href: string;
  label: string;
  labelLine1: string;
  labelLine2: string;
  icon: React.ReactNode;
}

const STATIC_NAV_META: Omit<NavItem, "href">[] = [
  { label: "Cost prediction", labelLine1: "Cost", labelLine2: "Prediction", icon: <TrendingUp size={21} strokeWidth={2.5} /> },
  { label: "Designer feedback", labelLine1: "Designer", labelLine2: "Feedback", icon: <Heart size={21} strokeWidth={2.5} /> },
  { label: "Scenario modeler", labelLine1: "Scenario", labelLine2: "Modeler", icon: <BarChart2 size={21} strokeWidth={2.5} /> },
];

const STATIC_HREFS = ["/", "/feedback", "/scenario"] as const;

const SOON_ITEMS = [
  { label: "BOM automation", labelLine1: "BOM", labelLine2: "Automation", icon: <FileText size={21} strokeWidth={2.5} /> },
  { label: "Landed cost", labelLine1: "Landed", labelLine2: "Cost", icon: <Package size={21} strokeWidth={2.5} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, analyzeStep } = useAppStore();

  function resolveCostHref(): string {
    if (analyzeStep === "done") return "/estimate";
    if (analyzeStep === "normalization_preview") return "/preview";
    return "/";
  }

  const navItems: NavItem[] = STATIC_NAV_META.map((item, i) => ({
    ...item,
    href: i === 0 ? resolveCostHref() : STATIC_HREFS[i],
  }));

  function isActive(href: string) {
    if (href === "/estimate" || href === "/preview") {
      return pathname === "/" || pathname === "/estimate" || pathname === "/preview";
    }
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "flex flex-col text-white transition-all duration-200 sticky top-0 h-screen flex-shrink-0 z-[1]",
        sidebarCollapsed ? "w-[90px]" : "w-[248px]"
      )}
      style={{ background: SIDEBAR_BG }}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 h-[72px] px-5 border-b border-white/10",
          sidebarCollapsed && "justify-center px-0"
        )}
      >
        <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 bg-white/15">
          <Zap size={17} className="text-white" fill="white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div
              className="text-[14.5px] font-bold leading-tight tracking-[-0.2px] text-white"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
            >
              {APP_CONFIG.name}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5 tracking-[0.1px]">
              {APP_CONFIG.tagline}
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex flex-col pt-2 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex no-underline w-full transition-colors duration-150",
                sidebarCollapsed
                  ? "flex-col items-center justify-center py-5 gap-1.5"
                  : "flex-row items-center gap-3 px-4 py-3 mx-2 my-0.5 rounded-[10px]",
                !active && "hover:bg-white/10"
              )}
              style={active ? { background: SIDEBAR_ACTIVE } : {}}
            >
              <span className="flex-shrink-0 text-white" style={{ filter: active ? "none" : "opacity(0.82)" }}>
                {item.icon}
              </span>
              {sidebarCollapsed ? (
                <span
                  className="text-[10px] font-medium text-center leading-[15px] tracking-[0.4px] text-white"
                  style={{ opacity: active ? 1 : 0.82 }}
                >
                  {item.labelLine1}
                  <br />
                  {item.labelLine2}
                </span>
              ) : (
                <span
                  className={cn(
                    "text-[13px] leading-[1.3]",
                    active ? "text-white font-semibold" : "text-white/70 font-medium"
                  )}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className={cn("border-t border-white/10 my-3", sidebarCollapsed ? "mx-4" : "mx-5")} />

        {SOON_ITEMS.map((item) => (
          <span
            key={item.label}
            className={cn(
              "flex opacity-35 cursor-not-allowed select-none w-full",
              sidebarCollapsed
                ? "flex-col items-center justify-center py-5 gap-1.5"
                : "flex-row items-center gap-3 px-4 py-3 mx-2 my-0.5 rounded-[10px]"
            )}
          >
            <span className="flex-shrink-0 text-white">{item.icon}</span>
            {sidebarCollapsed ? (
              <span className="text-[10px] font-medium text-center leading-[15px] tracking-[0.4px] text-white">
                {item.labelLine1}
                <br />
                {item.labelLine2}
              </span>
            ) : (
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="text-[13px] font-medium text-white">{item.label}</span>
                <span className="text-[8.5px] uppercase tracking-[0.5px] font-semibold bg-white/15 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  Soon
                </span>
              </div>
            )}
          </span>
        ))}
      </nav>

      {/* Collapse toggle — temporarily disabled; re-enable toggleSidebar when expanding sidebar is needed */}
      {/* <div className="border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex items-center gap-2 w-full px-4 py-3.5 text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors cursor-pointer",
            sidebarCollapsed && "justify-center"
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className="text-[10.5px]">Collapse</span>
            </>
          )}
        </button>

        {!sidebarCollapsed && (
          <div className="px-5 pb-4 text-[10px] text-white/25 leading-[1.5]">
            {APP_CONFIG.brand} · {APP_CONFIG.name} · {APP_CONFIG.phase}
          </div>
        )}
      </div> */}
    </aside>
  );
}

