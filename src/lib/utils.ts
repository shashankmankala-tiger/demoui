import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCost(value: number | null, decimals = 2): string {
  if (value === null) return "—";
  return `$${value.toFixed(decimals)}`;
}

export function formatDelta(delta: number | null): string | null {
  if (delta === null) return null;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}$${delta.toFixed(2)}`;
}
