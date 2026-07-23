"use client";

import Starfield from "./Starfield";
import FluidCursor from "./FluidCursor";
import Orb from "./Orb";
import Marquee from "./Marquee";
import AiAvatar from "./AiAvatar";
import PromptBar from "./chat/PromptBar";

// Entrance is CSS-driven (compositor), so content is never trapped invisible
// even when the fluid sim is busy on the main thread.
export default function Hero() {
  return (
    <>
      <FluidCursor />
      <Starfield />
      <div className="gridbg" aria-hidden />

      <header className="top">
        <span className="pill"><span className="livedot" /> Available for roles</span>
        <div className="topright">
          <a className="ghostbtn" href="https://github.com/roybishal362" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="ghostbtn" href="#">Résumé</a>
        </div>
      </header>

      <main className="hero">
        <div className="greeting rise" style={{ animationDelay: "0s" }}>
          <AiAvatar state="greeting" size={52} />
          <span>Hi, I&apos;m <b>Bishal Roy</b></span>
        </div>
        <p className="eyebrow rise" style={{ animationDelay: "0.05s" }}>Applied ML / AI Engineer · Pune, IN</p>

        <div className="rise" style={{ animationDelay: "0.15s" }}><Orb /></div>

        <h1 className="hero-title rise" style={{ animationDelay: "0.28s" }}>
          Don&apos;t read my résumé.<br /><span className="grad">Ask my AI.</span>
        </h1>

        <p className="hero-sub rise" style={{ animationDelay: "0.4s" }}>
          A digital twin trained on my real projects, competitions and papers.{" "}
          <b>Ask it anything</b> — it answers in my voice and pulls up the receipts.
        </p>

        <div className="rise" style={{ animationDelay: "0.52s", width: "100%" }}>
          <PromptBar />
        </div>

        <div className="rise" style={{ animationDelay: "0.64s", width: "100%" }}><Marquee /></div>
      </main>
    </>
  );
}
