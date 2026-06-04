"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Settings, LogOut } from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";

export function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="flex items-center gap-4 px-6 h-[64px] sticky top-0 z-30 border-b border-[var(--line)]"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "saturate(180%) blur(14px)",
      }}
    >
      {/* App branding */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div>
          <div
            className="text-[14px] font-bold leading-tight text-[var(--navy)]"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            {APP_CONFIG.name}
          </div>
          <div className="text-[10px] text-[var(--muted)] leading-tight">
            {APP_CONFIG.tagline}
          </div>
        </div>
      </div>

      {/* Right: user profile with dropdown */}
      <div className="ml-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 pl-3 border-l border-[var(--line)] cursor-pointer group select-none bg-transparent border-0 border-l border-[var(--line)]"
        >
          <div
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 border border-[var(--line)]"
            style={{ background: "#e5ecf8" }}
          >
            <span className="text-[11px] font-bold" style={{ color: "#104AA1" }}>
              JD
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[12.5px] font-semibold leading-tight text-[var(--ink)]">
              John Doe
            </div>
            <div className="text-[10px] text-[var(--muted)] leading-tight">
              Designer
            </div>
          </div>
          <ChevronDown
            size={13}
            className="text-[var(--muted)] group-hover:text-[var(--ink)] transition-all ml-0.5"
            style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s ease" }}
          />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div
            className="absolute right-0 top-[calc(100%+8px)] w-[176px] bg-white border border-[var(--line)] rounded-[12px] py-1 z-50"
            style={{ boxShadow: "0 8px 24px rgba(17,17,26,.12), 0 2px 6px rgba(17,17,26,.06)" }}
          >
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[var(--ink)] hover:bg-[var(--chip)] transition-colors cursor-pointer text-left"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={14} className="text-[var(--muted)] flex-shrink-0" />
              Settings
            </button>
            <div className="mx-3 my-1 border-t border-[var(--line)]" />
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#dc2626] hover:bg-[#fff8f8] transition-colors cursor-pointer text-left"
              onClick={() => setDropdownOpen(false)}
            >
              <LogOut size={14} className="flex-shrink-0" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
