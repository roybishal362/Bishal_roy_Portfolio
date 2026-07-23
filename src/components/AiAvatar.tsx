"use client";

import { useEffect, useRef, useState } from "react";

// Bishal's Memoji, mapped to real conversational states. Each state is a bucket of
// expressions; the avatar cross-fades between them so it visibly REACTS — thinking,
// talking, celebrating a win, or confused on an error — like a Bitmoji that's alive.
export const MEMOJI = {
  greeting: ["greeting"],
  idle: ["peace"],
  listening: ["hopeful"],
  thinking: ["thinking", "pondering", "zen"],
  talking: ["excited", "laughing"],
  technical: ["coding", "idea"],
  success: ["success", "celebrate"],
  love: ["love", "grateful", "laughing"],
  error: ["confused", "nervous", "sad"],
  serious: ["determined", "bored"],
} as const;

export type AvatarState = keyof typeof MEMOJI;

// success / love / error play briefly, then relax back to idle even if the parent
// keeps the same state prop.
const SETTLE: Partial<Record<AvatarState, AvatarState>> = { success: "idle", love: "idle", error: "idle" };
const LOOP_MS: Partial<Record<AvatarState, number>> = { thinking: 900, technical: 800, talking: 620 };
const src = (n: string) => `/memoji/${n}.jpeg`;

// preload all 20 expressions once so a cross-fade never waits on the network
let warmed = false;
function warm() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  Array.from(new Set(Object.values(MEMOJI).flat())).forEach((n) => {
    const im = new Image();
    im.src = src(n);
  });
}

export default function AiAvatar({ state = "greeting", size = 96 }: { state?: AvatarState; size?: number }) {
  const first: string = (MEMOJI[state] ?? MEMOJI.greeting)[0];
  // two stable layers: we only fade AFTER the incoming image has actually loaded,
  // so you never see a half-painted frame.
  const [a, setA] = useState<string>(first);
  const [b, setB] = useState<string>(first);
  const [showA, setShowA] = useState(true);
  const showARef = useRef(true);
  const curRef = useRef<string>(first);
  const pendingRef = useRef<string | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    warm();
    reduce.current = typeof window !== "undefined" && typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = (next: string) => {
    if (next === curRef.current || pendingRef.current === next) return;
    pendingRef.current = next;
    if (showARef.current) setB(next); else setA(next);
  };

  const settleTo = (layer: "a" | "b", loaded: string) => {
    if (!pendingRef.current || pendingRef.current !== loaded) return;
    curRef.current = loaded;
    pendingRef.current = null;
    showARef.current = layer === "a";
    setShowA(layer === "a");
  };

  // drive the animation for the current state
  useEffect(() => {
    const frames = MEMOJI[state] ?? MEMOJI.greeting;
    go(frames[0]);
    if (reduce.current) return;

    // idle: mostly still, with an occasional wink for micro-life
    if (state === "idle") {
      const id = setInterval(() => {
        go("wink");
        setTimeout(() => go("peace"), 220);
      }, 6500);
      return () => clearInterval(id);
    }
    // success / love / error: flick to the second frame once, then SETTLE relaxes it
    if (SETTLE[state]) {
      const second = frames[1];
      if (second) {
        const t = setTimeout(() => go(second), 520);
        return () => clearTimeout(t);
      }
      return;
    }
    // thinking / talking / technical: loop the bucket
    if (frames.length < 2) return;
    let idx = 0;
    const ms = LOOP_MS[state] ?? 900;
    const id = setInterval(() => {
      idx = (idx + 1) % frames.length;
      const f = frames[idx];
      if (f) go(f);
    }, ms);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // relax success/love/error back to idle after the moment passes
  useEffect(() => {
    const to = SETTLE[state];
    if (!to) return;
    const t = setTimeout(() => go((MEMOJI[to] ?? MEMOJI.idle)[0]), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <span className={`ai-avatar${state === "talking" ? " speaking" : ""}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`lay${showA ? " on" : ""}`} src={src(a)} alt="Bishal's AI" onLoad={() => settleTo("a", a)} onError={() => settleTo("a", a)} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`lay${showA ? "" : " on"}`} src={src(b)} alt="" aria-hidden onLoad={() => settleTo("b", b)} onError={() => settleTo("b", b)} />
    </span>
  );
}
