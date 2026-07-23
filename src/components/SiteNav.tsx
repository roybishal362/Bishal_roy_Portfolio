"use client";

import { useRouter } from "next/navigation";

// Chat-first: each tab is an INPUT to the conversation.
// On the landing it navigates to /chat with the question; on the chat page it
// asks directly (onAsk), so clicking a tab mid-conversation actually works.
const NAV: { id: string; label: string; q: string; icon: React.ReactNode }[] = [
  { id: "projects", label: "Projects", q: "Show me all your projects", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { id: "experience", label: "Experience", q: "Walk me through your work experience.", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></> },
  { id: "competitions", label: "Competitions", q: "What competitions have you won?", icon: <><circle cx="12" cy="8" r="5" /><path d="M8.5 12.7 7 21l5-3 5 3-1.5-8.3" /></> },
  { id: "research", label: "Research", q: "Tell me about your research papers", icon: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></> },
  { id: "skills", label: "Skills", q: "What are your technical skills?", icon: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></> },
  { id: "about", label: "About", q: "Who are you? Walk me through your background and what you're into.", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></> },
  { id: "contact", label: "Contact", q: "How do I reach you?", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></> },
];

export default function SiteNav({ onAsk }: { onAsk?: (q: string) => void }) {
  const router = useRouter();
  const go = (q: string) => {
    if (onAsk) onAsk(q);
    else router.push(`/chat?query=${encodeURIComponent(q)}`);
  };
  return (
    <nav className="sidenav" aria-label="Sections">
      {NAV.map((n) => (
        <button key={n.id} onClick={() => go(n.q)}>
          <svg viewBox="0 0 24 24" aria-hidden>{n.icon}</svg>
          <span className="lbl">{n.label}</span>
        </button>
      ))}
    </nav>
  );
}
