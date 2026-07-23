<div align="center">

# Bishal Roy — AI-Native Portfolio

**Don't read my résumé. Ask my AI.**

A portfolio you *talk to*. Instead of scrolling a static page, you ask a grounded digital twin — it answers in my voice, then renders the answer as rich, interactive UI.

[![Next.js](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-D97757?style=flat-square)](https://www.anthropic.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deploy-000?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## Why this exists

A résumé is a static list that every candidate hands over. It can't answer follow-ups, and most people never read past the first third.

So I built the alternative: **an AI that knows my work and answers questions about it.** Ask *"what's your strongest project?"* and you get a real answer plus a swipeable card deck. Ask *"what have you won?"* and the placements render as a ranked list. Same information a recruiter wants — delivered the way they'd actually consume it.

It's also an honest demo of what I build: grounded systems that **refuse to hallucinate**.

## How it works

```
Landing (/)                          Chat (/chat?query=…)
┌──────────────────────┐             ┌──────────────────────────────┐
│  orb + memoji        │  navigates  │  reactive memoji (header)    │
│  "Ask my AI"  ───────┼────────────▶│  answer + generative-UI card │
│  left nav rail       │             │  quick-questions rail        │
└──────────────────────┘             └──────────────────────────────┘
```

**The grounding trick.** The model never invents facts. Everything it can say comes from one typed source of truth (`src/data/knowledge.ts`), serialised into a prompt-cached system prompt. The tools it can call don't *fetch* data — they are **UI triggers**. The model decides *which card to show*; the card's contents render from curated data.

The LLM controls presentation, the data controls truth, and hallucination has nowhere to enter.

```
question → Claude (streaming + native tool_use)
              │
              ├── text ───────┐
              └── tool_use ───┤  re-emitted over a small custom SSE protocol
                              ▼
                  client block reducer → prose + inline React cards
```

## Features

| | |
|---|---|
| **Grounded digital twin** | Answers in first person from a typed knowledge base. Won't invent numbers, employers or placements. |
| **Generative UI** | The model picks the card: project carousel, experience timeline, competitions, research, skills, résumé, contact. |
| **Reactive Memoji** | 20 expressions across 10 states — thinks, talks, celebrates, gets confused. Cross-fades only *after* the next frame has loaded, so it never flickers. |
| **Voice mode** | Hands-free: speech recognition in, natural TTS out, then it listens again. Falls back to browser speech when no key is set. |
| **Streaming + failover** | Server-Sent Events with prompt caching; Groq automatically covers for Anthropic if it fails. |
| **Project deep-dives** | Real screenshots pulled from each project's own repo, expanding into problem → approach → architecture → results, with live demo links. |

## Tech stack

- **Framework** — Next.js 15 (App Router), React 19, TypeScript (strict)
- **AI** — Anthropic Claude: streaming with native `tool_use`, prompt-cached system prompt; Groq fallback
- **Voice** — Web Speech Recognition · ElevenLabs TTS (optional) with `speechSynthesis` fallback
- **UI** — Hand-written CSS (no UI framework), Framer Motion, Three.js orb, WebGL fluid cursor
- **Deploy** — Vercel

## Running locally

```bash
git clone https://github.com/roybishal362/Bishal_roy_Portfolio.git
cd Bishal_roy_Portfolio
npm install
cp .env.local.example .env.local   # add your keys
npm run dev                        # http://localhost:3000
```

### Environment

| Variable | Required | Purpose |
|---|:---:|---|
| `ANTHROPIC_API_KEY` | ✅ | Powers the chat |
| `ANTHROPIC_MODEL` | — | Defaults to `claude-haiku-4-5-20251001` |
| `GROQ_API_KEY` | — | Automatic fallback if Anthropic is unavailable |
| `GROQ_MODEL` | — | Defaults to `llama-3.3-70b-versatile` |
| `ELEVENLABS_API_KEY` | — | Natural voice. Without it, voice mode uses the browser's built-in speech |
| `ELEVENLABS_VOICE_ID` | — | Override the default male voice |

> `.env.local` is gitignored and never committed. On Vercel, add these under **Settings → Environment Variables**.

## Project structure

```
src/
├── app/
│   ├── page.tsx              # landing — orb, memoji, prompt, nav rail
│   ├── chat/page.tsx         # full-screen conversation
│   ├── api/chat/route.ts     # Claude streaming + tool_use → SSE, Groq fallback
│   └── api/tts/route.ts      # natural text-to-speech
├── components/
│   ├── chat/                 # ChatScreen, cards, quick questions, prompt bar
│   ├── cards/                # project poster cards + expand modal
│   └── AiAvatar.tsx          # reactive Memoji state machine
├── data/knowledge.ts         # ← single source of truth
└── lib/context.ts            # persona + knowledge → system prompt
```

**Forking this for yourself?** Replace `src/data/knowledge.ts` and the persona in `src/lib/context.ts`, drop your own images into `public/`, and it's your portfolio.

## About me

Applied ML / AI Engineer. I build production GenAI — multi-agent systems, RAG, LLM fine-tuning — and I care most about systems that stay grounded and refuse to make things up.

Smart India Hackathon 2024 — **All India Rank 2** of 49,000+ teams · Rajasthan Royals hackathon — **4th of 7,599** · first-author paper under review.

[GitHub](https://github.com/roybishal362) · [LinkedIn](https://www.linkedin.com/in/bishal-roy-5410b5257/) · roybishal9989@gmail.com

<div align="center"><sub>Built with Next.js and Claude. Ask it something.</sub></div>
