"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; a: number; vx: number; vy: number; tw: number; ts: number; hue: string; glint: boolean };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = canvas, g = ctx;

    const HUES = ["255,255,255", "200,210,255", "190,150,255", "150,220,255"];
    let w = 0, h = 0, raf = 0, t = 0;
    let pts: P[] = [];

    function init() {
      w = el.width = window.innerWidth;
      h = el.height = window.innerHeight;
      const count = Math.min(140, Math.floor((w * h) / 14000));
      pts = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.6 + 0.15,
        vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
        tw: Math.random() * 6.28, ts: Math.random() * 0.03 + 0.008,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        glint: i % 12 === 0,
      }));
    }

    function star(px: number, py: number, s: number, alpha: number, hue: string) {
      g.strokeStyle = `rgba(${hue},${alpha})`;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(px - s, py); g.lineTo(px + s, py);
      g.moveTo(px, py - s); g.lineTo(px, py + s);
      g.stroke();
    }

    function draw() {
      if (!reduce) t += 0.016;
      g.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const a = p.a * (0.45 + 0.55 * Math.sin(t * p.ts * 60 + p.tw));
        if (p.glint) {
          const s = p.r * 3 * (0.7 + 0.3 * Math.sin(t * p.ts * 40 + p.tw));
          star(p.x, p.y, s, Math.max(0, a), p.hue);
          g.beginPath(); g.arc(p.x, p.y, p.r * 0.8, 0, Math.PI * 2);
          g.fillStyle = `rgba(${p.hue},${Math.max(0, a)})`; g.fill();
        } else {
          g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fillStyle = `rgba(${p.hue},${Math.max(0, a)})`; g.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, []);

  return <canvas ref={ref} className="stars" aria-hidden />;
}
