"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PROJECTS, type Project } from "@/data/knowledge";
import { ProjectPoster, ProjectModal } from "./projectPieces";

const CARD = 246;
const GAP = 14;

export default function ProjectCarousel({ onAsk }: { onAsk: (q: string) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const check = () => {
    const t = track.current;
    if (!t) return;
    setCanL(t.scrollLeft > 4);
    setCanR(t.scrollLeft < t.scrollWidth - t.clientWidth - 4);
  };
  const by = (d: 1 | -1) => track.current?.scrollBy({ left: d * (CARD + GAP), behavior: "smooth" });
  useEffect(() => { check(); }, []);

  return (
    <div className="pcar">
      <div className="pcar-top">
        <span className="t">Projects</span>
        <span className="s">Tap any card to dig in.</span>
        <div className="pcar-arrows">
          <button onClick={() => by(-1)} disabled={!canL} aria-label="Previous">‹</button>
          <button onClick={() => by(1)} disabled={!canR} aria-label="Next">›</button>
        </div>
      </div>

      <div className="pcar-track" ref={track} onScroll={check}>
        {PROJECTS.map((p, i) => (
          <ProjectPoster key={p.id} p={p} index={i} onOpen={() => setOpen(p)} />
        ))}
      </div>

      <AnimatePresence>
        {open && <ProjectModal p={open} onClose={() => setOpen(null)} onAsk={onAsk} />}
      </AnimatePresence>
    </div>
  );
}
