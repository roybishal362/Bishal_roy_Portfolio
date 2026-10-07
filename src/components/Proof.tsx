"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { PROFILE, PROJECTS, COMPETITIONS, EXPERIENCE, type Project } from "@/data/knowledge";
import { ProjectPoster, ProjectModal } from "./cards/projectPieces";

// "The 30-second version": everything a recruiter needs without typing a question.
// Plain CSS, no entrance animation, so it is always visible even when the fluid sim is busy.
// Every number here also appears in data/knowledge.ts and on the résumé.
const STATS: { value: string; label: string }[] = [
  { value: "~10 min", label: "to turn a 4-hour class into instructor feedback, for about $1" },
  { value: "3 days / week", label: "of manual review saved (estimated), for a team of about 100 programme managers" },
  { value: "84% → 99%", label: "vision accuracy, tested against a labelled answer key" },
  { value: "10-15%", label: "lower LLM cost on long classes, from prompt caching" },
];

const STACK = ["Python", "LLM pipelines", "RAG", "AI agents", "LangChain", "FastAPI", "PyTorch", "XGBoost", "SQL", "PostgreSQL", "Next.js", "Docker"];

export default function Proof() {
  const router = useRouter();
  const [open, setOpen] = useState<Project | null>(null);
  const featured = PROJECTS.filter((p) => p.featured);
  const now = EXPERIENCE[0];
  const ask = (q: string) => router.push(`/chat?query=${encodeURIComponent(q)}`);

  return (
    <section className="proof" id="proof" aria-label="The 30-second version">
      <p className="proof-eyebrow">The 30-second version</p>
      <h2 className="proof-title">No time to chat? Here&apos;s the proof.</h2>
      <p className="proof-sum">{PROFILE.summary}</p>

      <div className="proof-cta">
        <a className="proof-btn primary" href="/Bishal_Roy_Resume.pdf" target="_blank" rel="noopener noreferrer">Download résumé ↗</a>
        <a className="proof-btn" href="/Bishal_Roy_Academic_CV.pdf" target="_blank" rel="noopener noreferrer">Academic CV ↗</a>
        <a className="proof-btn" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a className="proof-btn" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a className="proof-btn" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      </div>

      {now && (
        <div className="proof-block">
          <h3 className="proof-h">Most recent role</h3>
          <div className="proof-now">
            <div className="proof-now-head">
              <span className="org">{now.org}</span>
              <span className="role">{now.role} · Apr 2026 - Oct 2026</span>
            </div>
            <p className="proof-now-line">
              <b>Full end-to-end ownership</b> of Feedback Loop, a live AI platform that scores 3,000+ classes and drafts instructor feedback with a multi-stage LLM pipeline.
            </p>
            <div className="proof-stats">
              {STATS.map((s) => (
                <div key={s.value}><span className="v">{s.value}</span><span className="l">{s.label}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="proof-block">
        <h3 className="proof-h">Wins</h3>
        <div className="proof-wins">
          {COMPETITIONS.map((c) => (
            <div className="proof-win" key={c.event} style={{ ["--mc" as string]: c.accent }}>
              <span className="rk">{c.rank}</span>
              <span className="ev">{c.event}</span>
              <span className="sc">{c.scope}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="proof-block">
        <h3 className="proof-h">Projects <span>tap a card for the full story</span></h3>
        <div className="proof-projects">
          {featured.map((p, i) => (
            <ProjectPoster key={p.id} p={p} index={i} proof onOpen={() => setOpen(p)} />
          ))}
        </div>
        <button className="proof-more" onClick={() => ask("Show me all your projects")}>See all {PROJECTS.length} projects →</button>
      </div>

      <div className="proof-block">
        <h3 className="proof-h">Stack</h3>
        <div className="proof-stack">{STACK.map((s) => <span key={s}>{s}</span>)}</div>
      </div>

      <div className="proof-end">
        <a className="proof-btn primary" href="/Bishal_Roy_Resume.pdf" target="_blank" rel="noopener noreferrer">Download résumé ↗</a>
        <a className="proof-btn" href="/Bishal_Roy_Academic_CV.pdf" target="_blank" rel="noopener noreferrer">Academic CV ↗</a>
        <button className="proof-btn" onClick={() => ask("Why should I hire you?")}>Ask my AI why you should hire me →</button>
      </div>

      <AnimatePresence>
        {open && <ProjectModal p={open} onClose={() => setOpen(null)} onAsk={ask} />}
      </AnimatePresence>
    </section>
  );
}
