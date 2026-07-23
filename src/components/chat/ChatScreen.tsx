"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AiAvatar, { type AvatarState } from "../AiAvatar";
import SiteNav from "../SiteNav";
import QuickQuestions from "./QuickQuestions";
import { AiMessage, StatusRow } from "./cards";
import { STATUS_LABELS, aiText, hasCardBlock, speakable, type Msg } from "./types";

export default function ChatScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");
  const autoSubmitted = useRef(false);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [avatar, setAvatar] = useState<AvatarState>("greeting");
  const avatarRef = useRef<AvatarState>("greeting");
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const setAv = (s: AvatarState) => { if (avatarRef.current !== s) { avatarRef.current = s; setAvatar(s); } };

  // ---------- voice mode: hands-free talk with the twin ----------
  const [voiceMode, setVoiceMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceReady, setVoiceReady] = useState(true);
  const voiceModeRef = useRef(false);
  const recogRef = useRef<{ start: () => void; stop: () => void; abort: () => void } | null>(null);

  // MALE voice, Indian English first, then UK/US male, then any English.
  function pickVoice(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices();
    if (!vs.length) return null;
    const MALE = /(ravi|rishi|prabhat|hemant|madhur|david|mark|guy|george|daniel|alex|christopher|eric|brian|liam|male)/i;
    const FEMALE = /(female|zira|heera|swara|kalpana|aria|jenny|susan|linda|samantha|karen|moira|tessa|zoe|neerja)/i;
    const en = vs.filter((v) => /^en/i.test(v.lang));
    const male = en.filter((v) => MALE.test(v.name) && !FEMALE.test(v.name));
    return (
      male.find((v) => /en[-_]IN/i.test(v.lang)) ||
      male.find((v) => /en[-_]GB/i.test(v.lang)) ||
      male[0] ||
      en.find((v) => /en[-_]IN/i.test(v.lang)) ||
      en[0] ||
      null
    );
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stopSpeech() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    setSpeaking(false);
  }

  // fallback: the browser's built-in voice (always available, but robotic)
  function browserSpeak(say: string, onDone?: () => void) {
    if (typeof window === "undefined" || !window.speechSynthesis) { onDone?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(say);
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 1.02;
    u.pitch = 0.92; // lower — reads male
    u.onstart = () => { setSpeaking(true); setAv("talking"); };
    u.onend = () => { setSpeaking(false); setAv("idle"); onDone?.(); };
    u.onerror = () => { setSpeaking(false); onDone?.(); };
    window.speechSynthesis.speak(u);
  }

  // Prefer real, natural TTS (ElevenLabs via /api/tts). Falls back to the
  // browser voice when no key is configured (route returns 204).
  async function speak(text: string, onDone?: () => void) {
    const say = speakable(text);
    if (!say) { onDone?.(); return; }
    stopSpeech();
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: say }),
      });
      if (r.ok && (r.headers.get("content-type") || "").includes("audio")) {
        const url = URL.createObjectURL(await r.blob());
        const a = new Audio(url);
        audioRef.current = a;
        a.onplay = () => { setSpeaking(true); setAv("talking"); };
        a.onended = () => { setSpeaking(false); setAv("idle"); URL.revokeObjectURL(url); audioRef.current = null; onDone?.(); };
        a.onerror = () => { URL.revokeObjectURL(url); browserSpeak(say, onDone); };
        await a.play();
        return;
      }
    } catch { /* fall through to the browser voice */ }
    browserSpeak(say, onDone);
  }

  function startListening() {
    if (typeof window === "undefined") return;
    const W = window as unknown as { SpeechRecognition?: new () => never; webkitSpeechRecognition?: new () => never };
    const SR = (W.SpeechRecognition || W.webkitSpeechRecognition) as unknown as (new () => {
      lang: string; interimResults: boolean; continuous: boolean; maxAlternatives: number;
      start: () => void; stop: () => void; abort: () => void;
      onstart: (() => void) | null; onend: (() => void) | null;
      onerror: (() => void) | null;
      onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    }) | undefined;
    if (!SR) { setVoiceReady(false); return; }
    try { recogRef.current?.abort(); } catch { /* ignore */ }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onstart = () => { setListening(true); setAv("listening"); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e) => {
      const said = e.results?.[0]?.[0]?.transcript ?? "";
      setListening(false);
      if (said.trim()) ask(said.trim());
    };
    recogRef.current = r;
    try { r.start(); } catch { setListening(false); }
  }

  function stopListening() {
    try { recogRef.current?.abort(); } catch { /* ignore */ }
    setListening(false);
  }

  function toggleVoiceMode() {
    const next = !voiceMode;
    setVoiceMode(next);
    voiceModeRef.current = next;
    if (next) startListening();
    else { stopListening(); stopSpeech(); setAv("idle"); }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const warmVoices = () => window.speechSynthesis.getVoices();
    warmVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", warmVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", warmVoices);
      window.speechSynthesis.cancel();
    };
  }, []);
  useEffect(() => () => { stopListening(); stopSpeech(); }, []);

  // Only the CURRENT answer is shown (mirrors the reference), with the pending
  // question parked in the header until the answer arrives.
  const { currentAI, latestUser, hasActiveTool } = useMemo(() => {
    let lastAI = -1, lastUser = -1;
    msgs.forEach((m, i) => { if (m.role === "ai") lastAI = i; else lastUser = i; });
    const aiMsg = lastAI !== -1 && lastAI > lastUser ? msgs[lastAI] : null;
    const cur = aiMsg && aiMsg.role === "ai" && aiMsg.blocks.length > 0 ? aiMsg : null;
    const userMsg = lastUser !== -1 ? msgs[lastUser] : null;
    return {
      currentAI: cur as Extract<Msg, { role: "ai" }> | null,
      latestUser: (userMsg && userMsg.role === "user" ? userMsg : null) as Extract<Msg, { role: "user" }> | null,
      hasActiveTool: hasCardBlock(cur),
    };
  }, [msgs]);

  const isEmpty = !currentAI && !latestUser && !loading;
  const headerHeight = hasActiveTool ? 118 : 212;

  useEffect(() => {
    if (!working) return;
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_LABELS.length), 1300);
    return () => clearInterval(id);
  }, [working]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [currentAI]);

  function appendText(v: string) {
    setMsgs((m) => {
      const c = [...m]; const last = c[c.length - 1];
      if (!last || last.role !== "ai") return c;
      const blocks = [...last.blocks]; const lb = blocks[blocks.length - 1];
      if (lb && lb.kind === "text") blocks[blocks.length - 1] = { kind: "text", text: lb.text + v };
      else blocks.push({ kind: "text", text: v });
      c[c.length - 1] = { role: "ai", blocks }; return c;
    });
  }
  function addCard(name: string, props: Record<string, unknown>) {
    setMsgs((m) => {
      const c = [...m]; const last = c[c.length - 1];
      if (!last || last.role !== "ai") return c;
      c[c.length - 1] = { role: "ai", blocks: [...last.blocks, { kind: "card", name, props }] }; return c;
    });
  }

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loadingRef.current) return;
    loadingRef.current = true;
    let history: { role: string; content: string }[] = [];
    setMsgs((m) => {
      history = m.slice(-8).map((x) => ({ role: x.role === "user" ? "user" : "assistant", content: aiText(x) })).filter((h) => h.content);
      return [...m, { role: "user", text: q }, { role: "ai", blocks: [] }];
    });
    setLoading(true); setWorking(true); setStatusIdx(0); setAv("thinking");
    stopSpeech(); stopListening();

    let spoken = "";
    let firstSeen = false;
    const firstEvent = () => { if (!firstSeen) { firstSeen = true; setWorking(false); } };

    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, history }) });
      if (!res.ok || !res.body) throw new Error("bad");
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop() || "";
        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const raw = line.slice(5).trim(); if (!raw) continue;
          let evt: { t: string; v?: string; name?: string; props?: Record<string, unknown> };
          try { evt = JSON.parse(raw); } catch { continue; }
          if (evt.t === "text" && evt.v) { firstEvent(); setAv("talking"); spoken += evt.v; appendText(evt.v); }
          else if (evt.t === "card" && evt.name) { firstEvent(); setAv("success"); addCard(evt.name, evt.props || {}); }
        }
      }
      // voice mode: answer out loud, then start listening again — a real conversation
      if (voiceModeRef.current && spoken.trim()) {
        speak(spoken, () => { if (voiceModeRef.current) startListening(); });
      } else { setAv("success"); setTimeout(() => setAv("idle"), 2600); }
    } catch {
      setWorking(false);
      appendText("Sorry — I hit a snag reaching the model. Try again, or ask me about a project like Kakehashi or VayuNetra.");
      setAv("error");
    } finally { setLoading(false); setWorking(false); loadingRef.current = false; }
  }

  useEffect(() => {
    if (initialQuery && !autoSubmitted.current) {
      autoSubmitted.current = true;
      ask(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = inputRef.current?.value ?? "";
    if (inputRef.current) inputRef.current.value = "";
    ask(v);
  }

  return (
    <div className="cs-root">
      {/* left rail stays visible while you chat — asks directly instead of navigating */}
      <SiteNav onAsk={ask} />

      <div className="cs-topright">
        <a className="ghostbtn" href="/Bishal_Roy_Resume_1page.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a>
        <button className="ghostbtn" onClick={() => router.push("/")}>← Home</button>
      </div>

      <div className="cs-header">
        <div className={`cs-headpad${hasActiveTool ? " tight" : ""}`}>
          <button className="cs-avatar" onClick={() => router.push("/")} aria-label="Back to home" title="Back to home">
            <AiAvatar state={avatar} size={hasActiveTool ? 80 : 112} />
          </button>
          {voiceMode && (
            <div className={`cs-voice${listening ? " live" : ""}`}>
              {!voiceReady ? "Voice needs Chrome or Edge"
                : listening ? "Listening… just talk"
                : speaking ? "Speaking…"
                : loading ? "Thinking…"
                : "Tap the mic button to stop"}
            </div>
          )}
          {/* pending question parks here until the answer lands; unmounts instantly
              so it can never overlap the answer once the header shrinks */}
          {latestUser && !currentAI && (
            <div className="cs-userq">
              <div className="msg user">{latestUser.text}</div>
            </div>
          )}
        </div>
      </div>

      <div className="cs-main">
        <div className="cs-scroll" ref={scrollRef} style={{ paddingTop: headerHeight }}>
          {isEmpty ? (
            <div className="cs-landing">
              <p>Ask me anything — my work, my wins, why I&apos;m obsessed with grounded AI, or whether I&apos;m better at code or cricket. 😁</p>
            </div>
          ) : currentAI ? (
            <div className="cs-answer">
              <AiMessage msg={currentAI} onAsk={ask} />
              {currentAI.blocks.some((b) => b.kind === "text") && (
                <button
                  className="cs-speak"
                  onClick={() => {
                    if (speaking) { stopSpeech(); setAv("idle"); return; }
                    speak(currentAI.blocks.filter((b) => b.kind === "text").map((b) => (b as { text: string }).text).join(" "));
                  }}
                >
                  {speaking ? "■ Stop" : "🔊 Read aloud"}
                </button>
              )}
            </div>
          ) : working ? (
            <div className="cs-answer"><StatusRow statusIdx={statusIdx} /></div>
          ) : null}
        </div>

        <div className="cs-bottom">
          <QuickQuestions onAsk={ask} />
          <form className="cs-input" onSubmit={submit}>
            <button
              type="button"
              className={`cs-mic${voiceMode ? " on" : ""}${listening ? " live" : ""}`}
              onClick={toggleVoiceMode}
              aria-pressed={voiceMode}
              aria-label={voiceMode ? "Turn voice mode off" : "Turn voice mode on"}
              title={voiceMode ? "Voice mode is ON — tap to stop" : "Voice mode — tap, then just talk"}
            >
              <svg viewBox="0 0 24 24" aria-hidden><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v4" /></svg>
            </button>
            <input ref={inputRef} type="text" placeholder="Ask me anything…" maxLength={500} aria-label="Ask Bishal's AI" autoComplete="off" />
            <button className="send" type="submit" disabled={loading} aria-label="Send">↑</button>
          </form>
        </div>
      </div>
    </div>
  );
}
