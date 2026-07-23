export type Block = { kind: "text"; text: string } | { kind: "card"; name: string; props: Record<string, unknown> };
export type Msg = { role: "user"; text: string } | { role: "ai"; blocks: Block[] };

// playful "working" labels — the Memoji runs its own thinking loop while these rotate
export const STATUS_LABELS = ["Pondering", "Grounding", "Digging", "Cooking", "Vibing", "Schlepping"];

export function aiText(m: Msg): string {
  return m.role === "ai" ? m.blocks.filter((b) => b.kind === "text").map((b) => (b as { text: string }).text).join("") : m.text;
}

export function hasCardBlock(m: Msg | null): boolean {
  return !!m && m.role === "ai" && m.blocks.some((b) => b.kind === "card");
}

// The model occasionally slips markdown in. Strip it so we never SHOW raw
// asterisks — and never READ them out loud as "asterisk asterisk".
export function clean(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`]+/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Same, plus emoji removed — speech engines otherwise announce them.
export function speakable(s: string): string {
  return clean(s)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
