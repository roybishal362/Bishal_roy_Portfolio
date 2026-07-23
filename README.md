# Bishal Roy — Portfolio

An editorial-technical ("Systems Journal") portfolio for an **Applied GenAI / LLM Engineer**.
Its centerpiece isn't a screenshot of my work — it's a working demo of it: an **"Interrogate my
career" agent** that answers recruiter questions two ways, side by side:

- **Ungrounded** — a raw LLM with no sources. It guesses.
- **Grounded (mine)** — a RAG agent that answers *only* from my documented work and **cites every
  claim**, refusing to invent facts.

That contrast is my Kakehashi thesis (51% vs 4% accuracy, 0 vs 69 hallucinations) turned into
something a recruiter can actually play with.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- Bespoke editorial CSS (no UI framework), **Framer Motion** for motion
- LLM via **Groq** (`/api/interrogate` route). Retrieval is a dependency-free lexical retriever
  over `src/data/profile.ts` — swap for a vector store later without changing the API.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

The agent works **offline out of the box** (deterministic answers; retrieval + citations are real).
To get live natural-language answers:

```bash
cp .env.local.example .env.local
# then paste a free key from https://console.groq.com/keys into GROQ_API_KEY
```

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. Import it at vercel.com → it auto-detects Next.js.
3. Add `GROQ_API_KEY` (and optionally `GROQ_MODEL`) as an Environment Variable.
4. Deploy. Point your domain at it.

## Make it yours — where to edit

| What | File |
| --- | --- |
| Every fact the grounded agent can cite | `src/data/profile.ts` |
| Hero headline + stat strip | `src/components/Hero.tsx` |
| Sample questions | `src/components/Interrogate.tsx` (`SAMPLES`) |
| Work list + links | `src/components/WorkIndex.tsx` |
| Colors, type, spacing | `src/app/globals.css` (`:root` tokens) |
| The LLM prompts + model | `src/app/api/interrogate/route.ts` |

## Honesty note

The grounded agent can only say what's in `profile.ts`. Keep that file **true** — that's the whole
point. If you add a claim, make sure you can defend it in an interview.
