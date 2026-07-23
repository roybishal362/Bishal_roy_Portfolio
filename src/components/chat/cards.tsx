"use client";

import AiAvatar from "../AiAvatar";
import ProjectCarousel from "../cards/ProjectCarousel";
import { STATUS_LABELS, clean, type Msg } from "./types";
import { PROFILE, PROJECTS, COMPETITIONS, SKILLS, EXPERIENCE } from "@/data/knowledge";

// the "working" indicator — reactive Memoji + rotating playful label
export function StatusRow({ statusIdx }: { statusIdx: number }) {
  return (
    <div className="ai-status">
      <AiAvatar state="thinking" size={40} />
      <span className="sl">{STATUS_LABELS[statusIdx]}</span>
    </div>
  );
}

export function AiMessage({ msg, onAsk }: { msg: Extract<Msg, { role: "ai" }>; onAsk: (q: string) => void }) {
  return (
    <>
      {msg.blocks.map((b, i) =>
        b.kind === "text" ? (
          b.text ? <div key={i} className="msg ai">{clean(b.text)}</div> : null
        ) : (
          <Card key={i} name={b.name} props={b.props} onAsk={onAsk} />
        ),
      )}
    </>
  );
}

export function Card({ name, props, onAsk }: { name: string; props: Record<string, unknown>; onAsk: (q: string) => void }) {
  if (name === "show_projects") return <ProjectCarousel onAsk={onAsk} />;

  if (name === "show_project") {
    const p = PROJECTS.find((x) => x.id === props.id);
    if (!p) return null;
    return (
      <div className="cc" style={{ ["--cc-accent" as string]: p.accent }}>
        <div className="cc-head"><div className="t">{p.name}</div><div className="s">{p.tagline}</div></div>
        <div className="cc-metrics">{p.metrics.slice(0, 4).map((m) => (<div key={m.label}><div className="v">{m.value}</div><div className="l">{m.label}</div></div>))}</div>
        <div className="cc-foot">
          {p.links.repo && <a href={p.links.repo} target="_blank" rel="noopener noreferrer">repo ↗</a>}
          <button className="cc-btn" onClick={() => onAsk(`What was the hardest part of ${p.name}?`)}>ask more</button>
        </div>
      </div>
    );
  }

  if (name === "show_competitions") {
    return (
      <div className="cc">
        <div className="cc-head"><div className="t">Competitions</div><div className="s">Placements across hackathons &amp; Kaggle.</div></div>
        {COMPETITIONS.slice(0, 7).map((c, i) => (
          <div className="cc-row" key={i}><span className="rk" style={{ color: c.accent }}>{c.rank}</span><span className="nm"><b>{c.project}</b> · {c.event}</span></div>
        ))}
      </div>
    );
  }

  if (name === "show_about") {
    const cur = EXPERIENCE[0];
    return (
      <div className="cc ac">
        <div className="ac-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ac-photo" src="/bishal.png" alt="Bishal Roy" />
          <div><div className="ac-name">{PROFILE.name}</div><div className="ac-role">{PROFILE.role} · {PROFILE.location}</div></div>
        </div>
        <p className="ac-bio">Bengali kid from Chandrapur, obsessed with building AI that actually works and refuses to hallucinate. Competition-driven, cricket-feral, anime-loving night owl. 😁</p>
        <div className="ac-tags">{["Applied ML / AI", "GenAI · RAG", "Multi-agent", "Cricket 🏏", "Anime"].map((t) => <span key={t} className="ac-tag">{t}</span>)}</div>
        <div className="ac-facts">
          <div><span className="l">Now</span><span className="v">{cur ? `${cur.role} · ${cur.org}` : "Applied ML / AI"}</span></div>
          <div><span className="l">Studying</span><span className="v">{PROFILE.education}</span></div>
        </div>
        <div className="cc-foot">
          <button className="cc-btn" onClick={() => onAsk("Why did you get into AI/ML?")}>why AI?</button>
          <button className="cc-btn" onClick={() => onAsk("Why are you doing an APM internship when your skills are in applied AI?")}>why APM?</button>
          <button className="cc-btn" onClick={() => onAsk("Walk me through your journey.")}>my journey</button>
        </div>
      </div>
    );
  }

  if (name === "show_skills") {
    return (
      <div className="cc">
        <div className="cc-head"><div className="t">Skills</div><div className="s">What I build with.</div></div>
        <div className="sk-wrap">
          {SKILLS.map((g) => (
            <div className="sk-group" key={g.group}>
              <div className="sk-h">{g.group}</div>
              <div className="sk-chips">{g.items.map((it) => <span key={it} className="skill-chip">{it}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "show_research") {
    return (
      <div className="cc">
        <div className="cc-head"><div className="t">Research</div><div className="s">Two papers under review.</div></div>
        <div className="rc-paper primary">
          <div className="rc-venue">First author · under review · JAIR</div>
          <div className="rc-title">Predicting Problematic Internet Use in Children via QWK Optimization &amp; Multi-Modal Feature Engineering</div>
        </div>
        <div className="rc-paper">
          <div className="rc-venue">Co-author · under review · Pattern Recognition (Elsevier)</div>
          <div className="rc-title">Real-Time Indian Sign Language Translation using Deep Learning</div>
        </div>
      </div>
    );
  }

  if (name === "show_experience") {
    return (
      <div className="cc">
        <div className="cc-head"><div className="t">Experience</div><div className="s">Where I&apos;ve worked and what I actually shipped.</div></div>
        <div className="xpc-list">
          {EXPERIENCE.map((e) => (
            <div className="xpc-row" key={e.org}>
              <div className="xpc-role">{e.role}</div>
              <div className="xpc-meta"><span className="org">{e.org}</span><span className="dot">·</span><span className="per">{e.period}</span></div>
              <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "show_contact") {
    const items = [
      { icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></>, label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, color: "#60a5fa" },
      { icon: <><path d="M4 4h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1z" /></>, label: "Phone", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}`, color: "#34d399" },
      { icon: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>, label: "Location", value: "Pune, India · open to remote", href: "", color: "#a78bfa" },
      { icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4" /></>, label: "LinkedIn", value: "bishal-roy", href: PROFILE.linkedin, color: "#38bdf8" },
      { icon: <><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></>, label: "GitHub", value: "roybishal362", href: PROFILE.github, color: "#e5e7eb" },
    ];
    return (
      <div className="cc">
        <div className="cc-head"><div className="t">Get in touch</div><div className="s">Always up for a chat about AI, cricket, or a good problem to solve. 😁</div></div>
        <div className="ct-grid">
          {items.map((it) => (
            <div className="ct-tile" key={it.label}>
              <div className="ct-top">
                <span className="ct-ic" style={{ color: it.color }}><svg viewBox="0 0 24 24" aria-hidden>{it.icon}</svg></span>
                <span className="ct-label">{it.label}</span>
              </div>
              <div className="ct-value">{it.value}</div>
              {it.href && <a className="ct-btn" href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">Open {it.label} ↗</a>}
            </div>
          ))}
        </div>
        <div className="ct-looking">
          <h4>What I&apos;m looking for</h4>
          <p>Applied ML / GenAI Engineer roles — building grounded, production AI. India or remote, and I&apos;m available now. I&apos;m most drawn to problems where AI does something real, not a demo.</p>
        </div>
      </div>
    );
  }

  return null;
}
