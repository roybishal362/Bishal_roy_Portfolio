"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PromptBar() {
  const router = useRouter();
  const [input, setInput] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    router.push(`/chat?query=${encodeURIComponent(q)}`);
  }

  return (
    <form className="prompt" onSubmit={submit}>
      <input
        className="prompt-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask my AI about my work, competitions, or how to reach me…"
        aria-label="Ask Bishal's AI"
        maxLength={500}
      />
      <button className="send" type="submit" aria-label="Ask">↑</button>
    </form>
  );
}
