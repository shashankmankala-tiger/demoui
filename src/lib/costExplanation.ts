import type { CostExplanationData } from "@/types/api.types";

export interface GroupBreakdown {
  group: string;
  total: number;
  items: { label: string; delta: number }[];
}

export function signMoney(v: number): string {
  return v >= 0 ? `+$${v.toFixed(2)}` : `−$${Math.abs(v).toFixed(2)}`;
}

/** Parse the structured JSON cost explanation returned by the new backend. */
export function parseCostExplanationJson(data: CostExplanationData): GroupBreakdown[] {
  return data.drivers.map((driver) => ({
    group: driver.group,
    total: driver.net_impact,
    items: driver.features.map((f) => ({ label: f.display_name, delta: f.impact })),
  }));
}

/** Parse the legacy natural-language cost explanation string (fallback). */
export function parseCostExplanation(text: string): GroupBreakdown[] {
  const results: GroupBreakdown[] = [];

  for (const raw of text.split("\n")) {
    const line = raw.replace(/\.$/, "").trim();
    if (!line || line.startsWith("Predicted") || line.includes("account for")) continue;

    const m = line.match(
      /^(.+?)\s+(?:is the primary cost driver,\s+)?(?:(adds|adding)\s+\$?([\d.]+)|(reduces?\s+cost\s+by)\s+\$?([\d.]+))\s*\(([^)]+)\)/i
    );
    if (!m) continue;

    const group = m[1].trim();
    const isAdding = !!m[2];
    const amount = parseFloat(m[3] ?? m[5]);
    const total = isAdding ? amount : -amount;

    const items = (m[6] ?? "")
      .split(",")
      .map((s) => {
        const im = s.trim().match(/^(.+?)\s+([+-])\$?([\d.]+)$/);
        if (!im) return null;
        return { label: im[1].trim(), delta: (im[2] === "+" ? 1 : -1) * parseFloat(im[3]) };
      })
      .filter((x): x is { label: string; delta: number } => x !== null);

    results.push({ group, total, items });
  }

  return results;
}

export function buildNoteFromBreakdown(
  final: number | null,
  baseline: number,
  dept: string,
  groups: GroupBreakdown[]
): string {
  if (!final || groups.length === 0) return "";
  const sorted = [...groups].sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
  const top = sorted.slice(0, 2);
  const topStr = top.map((g) => `${g.group.toLowerCase()} (${signMoney(g.total)})`).join(" and ");
  const dir = final >= baseline ? "above" : "below";
  const absDelta = Math.abs(final - baseline);
  return `This style is predicted at $${final.toFixed(2)}, about $${absDelta.toFixed(2)} ${dir} a typical ${dept.toLowerCase()} style ($${baseline.toFixed(2)}). Biggest movers: ${topStr}.`;
}

export function buildDeltaNote(
  final: number | null,
  baseline: number,
  dept: string,
  groups: { group: string; shap: number; top_value_summary: string }[]
): string {
  if (!final) return "";
  const sorted = [...groups].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));
  const top = sorted.slice(0, 2);
  const topStr = top.map((g) => `<b>${g.group.toLowerCase()}</b> (${signMoney(g.shap)})`).join(" and ");
  const dir = final >= baseline ? "above" : "below";
  const absDelta = Math.abs(final - baseline);
  return `This style is predicted at <b>$${final.toFixed(2)}</b>, about <b>$${absDelta.toFixed(2)} ${dir}</b> a typical ${dept.toLowerCase()} style ($${baseline.toFixed(2)}). Biggest movers: ${topStr}.`;
}
