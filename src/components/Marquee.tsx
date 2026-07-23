import { COMPETITIONS } from "@/data/knowledge";

// A subtle "proof" ticker of real competition placements — single source of truth
// (data/knowledge.ts), not a hardcoded copy of the projects.
export default function Marquee() {
  const loop = [...COMPETITIONS, ...COMPETITIONS];
  return (
    <div className="marquee" aria-label="Competition highlights">
      <div className="mtrack">
        {loop.map((c, i) => (
          <div className="mchip" key={i} style={{ ["--mc" as string]: c.accent }}>
            <span className="mrank">{c.rank}</span>
            <span className="mev">{c.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
