"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { type Project } from "@/data/knowledge";

// a domain glyph per project — visual identity without needing screenshots
export const GLYPH: Record<string, string> = {
  kakehashi: "🌉",
  "c-trust": "🩺",
  vayunetra: "🌫️",
  cricket: "🏏",
  "amazon-ml": "🛒",
  piu: "🧠",
};

// the visual "poster" card face — used in the chat carousel AND the left Projects panel
export function ProjectPoster({ p, index = 0, onOpen }: { p: Project; index?: number; onOpen: () => void }) {
  return (
    <motion.button
      className="pcar-card"
      style={{ ["--a" as string]: p.accent }}
      onClick={onOpen}
      initial={{ y: 18 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: "easeOut" }}
    >
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="pcar-img" src={p.image} alt="" aria-hidden />
      ) : (
        <span className="pcar-glyph" aria-hidden>{GLYPH[p.id] ?? "✦"}</span>
      )}
      <span className="pcar-cat">{p.tags[0]}</span>
      <span className="pcar-name">{p.name}</span>
      <span className="pcar-spacer" />
      <span className="pcar-open">{p.links.demo ? "Live · View project →" : "View project →"}</span>
    </motion.button>
  );
}

// the expand-to-detail modal — shared, self-contained (Escape + scroll-lock handled here)
export function ProjectModal({ p, onClose, onAsk }: { p: Project; onClose: () => void; onAsk?: (q: string) => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <>
      {/* plain divs + CSS entrance: the base state is VISIBLE, so a stalled JS
          animation can never leave the modal stuck invisible */}
      <div className="pmodal-scrim" onClick={onClose} />
      <div className="pmodal" style={{ ["--a" as string]: p.accent }}>
        <button className="pmodal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="pmodal-event">{p.event} · {p.year}</div>
        <h3 className="pmodal-name">{p.name}</h3>
        <p className="pmodal-tag">{p.tagline}</p>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pmodal-shot" src={p.image} alt={`${p.name} screenshot`} />
        )}
        <div className="pmodal-metrics">
          {p.metrics.map((m) => (
            <div key={m.label}><span className="v">{m.value}</span><span className="l">{m.label}</span></div>
          ))}
        </div>
        <Sec h="The problem" p={p.problem} />
        <Sec h="The approach" p={p.approach} />
        <Sec h="Architecture" p={p.architecture} />
        <div className="pmodal-sec">
          <h4>Highlights</h4>
          <ul>{p.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </div>
        <div className="pmodal-sec">
          <h4>Stack</h4>
          <div className="pmodal-chips">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
        <div className="pmodal-foot">
          {p.links.demo && <a className="live" href={p.links.demo} target="_blank" rel="noopener noreferrer">● Live demo ↗</a>}
          {p.links.video && <a href={p.links.video} target="_blank" rel="noopener noreferrer">▶ Watch demo ↗</a>}
          {p.links.api && <a href={p.links.api} target="_blank" rel="noopener noreferrer">API ↗</a>}
          {p.links.bot && <a href={p.links.bot} target="_blank" rel="noopener noreferrer">Telegram bot ↗</a>}
          {p.links.repo && <a href={p.links.repo} target="_blank" rel="noopener noreferrer">View repository ↗</a>}
          {onAsk && <button onClick={() => { onClose(); onAsk(`What was the hardest part of ${p.name}?`); }}>Ask about it</button>}
        </div>
      </div>
    </>
  );
}

const Sec = ({ h, p }: { h: string; p: string }) => (
  <div className="pmodal-sec"><h4>{h}</h4><p>{p}</p></div>
);
