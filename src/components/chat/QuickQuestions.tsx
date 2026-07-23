"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUICK = [
  { key: "Me", emoji: "😁", color: "#4ECDC4", q: "Who are you? Tell me about yourself." },
  { key: "Projects", emoji: "🧩", color: "#8b5cf6", q: "Show me all your projects" },
  { key: "Skills", emoji: "🛠️", color: "#f59e0b", q: "What are your technical skills?" },
  { key: "Wins", emoji: "🏆", color: "#FFD166", q: "What competitions have you won?" },
  { key: "Experience", emoji: "💼", color: "#60a5fa", q: "Walk me through your work experience." },
  { key: "Fun", emoji: "🏏", color: "#FF6B6B", q: "Cricket or code — what are you better at?" },
  { key: "Contact", emoji: "✉️", color: "#06b6d4", q: "How do I reach you?" },
];

const GROUPS: { name: string; questions: string[] }[] = [
  { name: "Me", questions: ["Who are you?", "What are your passions?", "How did you get into AI/ML?", "Where do you see yourself in 5 years?"] },
  { name: "Professional", questions: ["Why should I hire you?", "Why are you doing an APM internship when your skills are in applied AI?", "Walk me through your journey.", "What's your educational background?", "How are you with DSA?"] },
  { name: "Projects", questions: ["Show me all your projects", "What's your strongest project?", "Tell me about Kakehashi", "Tell me about VayuNetra"] },
  { name: "Competitions", questions: ["What have you won?", "Tell me about SIH 2024", "What happened at the Rajasthan Royals hackathon?"] },
  { name: "Fun", questions: ["Cricket or code?", "What's the craziest thing about you?", "What anime do you love?", "What are you certain about that 90% of people get wrong?"] },
  { name: "Contact & future", questions: ["How can I reach you?", "What kind of project would make you say yes instantly?", "Where are you based?"] },
];

const SPECIAL = new Set([
  "Who are you?",
  "What's your strongest project?",
  "What have you won?",
  "Cricket or code?",
  "Why are you doing an APM internship when your skills are in applied AI?",
]);

export default function QuickQuestions({ onAsk }: { onAsk: (q: string) => void }) {
  const [sheet, setSheet] = useState(false);

  return (
    <>
      <div className="qq-rail" aria-label="Quick questions">
        {QUICK.map((q) => (
          <button key={q.key} className="qq-chip" onClick={() => onAsk(q.q)} title={q.q}>
            <span className="e" style={{ color: q.color }}>{q.emoji}</span>
            <span className="lbl">{q.key}</span>
          </button>
        ))}
        <button className="qq-chip more" onClick={() => setSheet(true)}>
          <span className="e">⋯</span><span className="lbl">More</span>
        </button>
      </div>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="qq-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              className="qq-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              role="dialog"
              aria-label="Quick questions"
            >
              <div className="qq-grab" aria-hidden />
              <div className="qq-sheet-in">
                {GROUPS.map((g) => (
                  <div className="qq-group" key={g.name}>
                    <h4>{g.name}</h4>
                    {g.questions.map((q) => (
                      <button
                        key={q}
                        className={SPECIAL.has(q) ? "qq-q special" : "qq-q"}
                        onClick={() => { setSheet(false); onAsk(q); }}
                      >
                        <span>{SPECIAL.has(q) ? "✦ " : ""}{q}</span>
                        <span className="ch">›</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
