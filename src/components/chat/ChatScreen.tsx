"use client";



import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import AiAvatar, { type AvatarState } from "../AiAvatar";

import SiteNav from "../SiteNav";

import QuickQuestions from "./QuickQuestions";

import { AiMessage, StatusRow } from "./cards";

import { STATUS_LABELS, aiText, hasCardBlock, type Msg } from "./types";



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



  // new answer → glide back to the top instead of snapping

  useEffect(() => {

    const el = scrollRef.current;

    if (!el) return;

    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    el.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  }, [latestUser?.text]);



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

          if (evt.t === "text" && evt.v) { firstEvent(); setAv("talking"); appendText(evt.v); }

          else if (evt.t === "card" && evt.name) { firstEvent(); setAv("success"); addCard(evt.name, evt.props || {}); }

        }

      }

      setAv("success"); setTimeout(() => setAv("idle"), 2600);

    } catch {

      setWorking(false);

      appendText("Sorry, I hit a snag reaching the model. Try again, or ask me about my work at Interview Kickstart or the Amazon ML Challenge.");

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

      {/* left rail stays visible while you chat, asks directly instead of navigating */}

      <SiteNav onAsk={ask} />



      <div className="cs-topright">

        <a className="ghostbtn" href="/Bishal_Roy_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a>

        <button className="ghostbtn" onClick={() => router.push("/")}>← Home</button>

      </div>



      <div className="cs-header">

        <div className={`cs-headpad${hasActiveTool ? " tight" : ""}`}>

          <button className="cs-avatar" onClick={() => router.push("/")} aria-label="Back to home" title="Back to home">

            <AiAvatar state={avatar} size={hasActiveTool ? 80 : 112} />

          </button>

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

              <p>Ask me anything: my work, my wins, why I&apos;m obsessed with grounded AI, or whether I&apos;m better at code or cricket. 😁</p>

            </div>

          ) : currentAI ? (

            <div className="cs-answer">

              <AiMessage msg={currentAI} onAsk={ask} />

            </div>

          ) : working ? (

            <div className="cs-answer"><StatusRow statusIdx={statusIdx} /></div>

          ) : null}

        </div>



        <div className="cs-bottom">

          <QuickQuestions onAsk={ask} />

          <form className="cs-input" onSubmit={submit}>

            <input ref={inputRef} type="text" placeholder="Ask me anything…" maxLength={500} aria-label="Ask Bishal's AI" autoComplete="off" />

            <button className="send" type="submit" disabled={loading} aria-label="Send">↑</button>

          </form>

        </div>

      </div>

    </div>

  );

}

