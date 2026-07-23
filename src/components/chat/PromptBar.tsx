"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

// Uncontrolled on purpose: a native input stays typeable even before React
// hydrates. A controlled value="" input is frozen until hydration attaches
// onChange — which is what made this box impossible to type in.
export default function PromptBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    router.push(`/chat?query=${encodeURIComponent(q)}`);
  }

  return (
    <form className="prompt" onSubmit={submit}>
      <input
        ref={inputRef}
        className="prompt-input"
        type="text"
        name="q"
        placeholder="Ask my AI about my work, competitions, or how to reach me…"
        aria-label="Ask Bishal's AI"
        maxLength={500}
        autoComplete="off"
      />
      <button className="send" type="submit" aria-label="Ask">↑</button>
    </form>
  );
}
