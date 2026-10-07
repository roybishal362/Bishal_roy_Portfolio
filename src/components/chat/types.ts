export type Block = { kind: "text"; text: string } | { kind: "card"; name: string; props: Record<string, unknown> };
export type Msg = { role: "user"; text: string } | { role: "ai"; blocks: Block[] };

// playful "working" labels, the Memoji runs its own thinking loop while these rotate
export const STATUS_LABELS = ["Pondering", "Grounding", "Digging", "Cooking", "Vibing", "Schlepping"];

export function aiText(m: Msg): string {
  return m.role === "ai" ? m.blocks.filter((b) => b.kind === "text").map((b) => (b as { text: string }).text).join("") : m.text;
}

export function hasCardBlock(m: Msg | null): boolean {
  return !!m && m.role === "ai" && m.blocks.some((b) => b.kind === "card");
}

// The model occasionally slips markdown in. Strip it so we never SHOW raw
// asterisks, and never READ them out loud as "asterisk asterisk".
export function clean(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    // no long dashes on screen, whatever the model writes: an em dash becomes a comma, an en dash a hyphen
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/(\d)\s*\u2013\s*(\d)/g, "$1-$2")
    .replace(/\s*\u2013\s*/g, ", ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`]+/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

