// ── Hardcoded Q&A pairs for the demo Cost Assistant ──────────────────────────
// Each entry has:
//   keywords  — if ANY of these words appear in the user's question, this answer fires
//   answer    — HTML string shown in the chat bubble
//
// Entries are checked in order — first match wins.
// Use <b>bold</b> and <span class="amt">$X.XX</span> for styling.

export interface DemoQA {
  keywords: string[];
  answer: string;
}

export const DEMO_QA: DemoQA[] = [
  {
    keywords: ["biggest", "driver", "main", "primary", "most"],
    answer:
      `The biggest cost driver for this style is <b>Construction</b> — specifically panel count (8 panels) and seam count (12 seams), adding <b class="amt">+$0.43</b> above the category baseline. Reducing panel count to 6 could save approximately <b class="amt">$0.10</b>.`,
  },
  {
    keywords: ["reduce", "cheaper", "lower", "save", "cut", "less"],
    answer:
      `The fastest way to reduce cost is to simplify construction: fewer panels and seams have the highest impact. Switching from <b>Flap pockets</b> to <b>On-seam pockets</b> could save ~<b class="amt">$0.15</b>. Shorter sleeve styles (e.g. Cap sleeve) also lower cost significantly. Use the <b>Scenario modeler</b> to model these changes.`,
  },
  {
    keywords: ["why", "explain", "how", "much", "breakdown", "because"],
    answer:
      `This <b>WOMENS FLEECE</b> is estimated at <b class="amt">$7.24</b>. The category baseline is <b class="amt">$6.90</b>. The <b class="amt">+$0.34</b> premium comes from construction complexity (+$0.43) partially offset by shape & fit savings (−$0.18). Fabric composition (No RD provided) is not included in this estimate.`,
  },
  {
    keywords: ["similar", "in line", "peer", "benchmark", "compare", "market", "range"],
    answer:
      `The typical cost range for a <b>WOMENS FLEECE / JACKET</b> is <b class="amt">$5.70 – $9.40</b>. This style at <b class="amt">$7.24</b> sits in the mid-range — roughly the 55th percentile. The 4 representative styles shown range from <b class="amt">$6.80 – $7.45</b>, so this estimate is well within market norms.`,
  },
  {
    keywords: ["fabric", "material", "cotton", "composition", "rd", "material cost"],
    answer:
      `Fabric composition is not included in this estimate because no RD number was provided. Adding an RD number enables a Databricks fabric lookup that can adjust the cost by <b class="amt">±$0.50 – $1.20</b> depending on the cotton content and origin.`,
  },
  {
    keywords: ["department", "category", "classification", "bomber", "jacket", "fleece"],
    answer:
      `The model classified this as <b>WOMENS FLEECE → JACKET → BOMBER</b> with <b>94% confidence</b>. If this is incorrect, you can override the department in the Style attributes tab — the cost model will re-run for the corrected category.`,
  },
];
