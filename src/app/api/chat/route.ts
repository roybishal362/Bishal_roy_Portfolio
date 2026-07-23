import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/context";
import { PROJECTS } from "@/data/knowledge";

export const runtime = "nodejs";
export const maxDuration = 30;

type Turn = { role: "user" | "assistant"; content: string };
type Body = { message?: string; history?: Turn[] };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Tools are UI-card triggers (curated content), not data sources — so facts never hallucinate.
const TOOLS: Anthropic.Tool[] = [
  { name: "show_project", description: "Render a rich card for ONE specific project. Call when the user asks about a specific project.", input_schema: { type: "object", properties: { id: { type: "string", enum: PROJECTS.map((p) => p.id) } }, required: ["id"] } },
  { name: "show_projects", description: "Render the gallery of all projects. Call when the user asks to see projects generally.", input_schema: { type: "object", properties: {} } },
  { name: "show_competitions", description: "Render competition placements. Call when the user asks about competitions, rankings, hackathons, or awards.", input_schema: { type: "object", properties: {} } },
  { name: "show_contact", description: "Render the contact card. Call when the user asks how to reach or hire Bishal.", input_schema: { type: "object", properties: {} } },
  { name: "show_about", description: "Render the About card (name, role, short bio, tags, current role, education). Call whenever asked who Bishal is, to introduce himself, or about his background/journey.", input_schema: { type: "object", properties: {} } },
  { name: "show_skills", description: "Render the skills card (grouped technical skills). Call when asked about skills, tech stack, or what he works with.", input_schema: { type: "object", properties: {} } },
  { name: "show_research", description: "Render the research card (papers under review). Call when asked about research, papers, or publications.", input_schema: { type: "object", properties: {} } },
  { name: "show_experience", description: "Render the work-experience timeline (roles, orgs, dates, what he shipped). Call when asked about work experience, internships, where he has worked, or his career so far.", input_schema: { type: "object", properties: {} } },
  { name: "show_resume", description: "Render the résumé card offering both a 1-page recruiter version and a detailed full version. Call when asked for a resume, CV, or a downloadable profile.", input_schema: { type: "object", properties: {} } },
];

const TOOL_NOTE =
  "\n\n## Cards you can show (generative UI)\n" +
  "You can call ONE tool per reply to render a rich VISUAL card. Let the card carry the detail; you add a short human sentence around it.\n" +
  "- show_about → who I am / introduce myself / my background / journey\n" +
  "- show_projects → a swipeable carousel of all my projects (asked to see my work generally)\n" +
  "- show_project(id) → one specific project's card\n" +
  "- show_competitions → my competition placements & rankings / what I've won\n" +
  "- show_skills → my technical skills / tech stack\n" +
  "- show_research → my research papers / publications\n" +
  "- show_experience → my work experience / internships / where I've worked\n" +
  "- show_resume → my résumé / CV (offers a 1-page and a detailed version)\n" +
  "- show_contact → how to reach / hire me\n" +
  "RULES:\n" +
  "- Match the question to a tool and CALL it: \"who are you / tell me about yourself\" → show_about; \"your projects\" → show_projects; a specific project (even \"your strongest?\") → show_project(id); \"what have you won / competitions\" → show_competitions; \"your skills\" → show_skills; \"research / papers\" → show_research; \"work experience / internships\" → show_experience; \"resume / CV\" → show_resume; \"how to reach you\" → show_contact.\n" +
  "- After the tool, add ONE short human sentence (a light question is great) — never restate what the card already shows, never dump metrics in prose.\n" +
  "- For a purely conversational/opinion question with no matching card (why AI, cricket vs code, hot takes, fun facts), just reply in your voice — no tool.\n" +
  "- Never call more than one tool per reply.";

async function groqAnswer(system: string, message: string, history: Turn[]): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "I need an API key to answer live. Meanwhile, ask me about Bishal's projects, competitions, experience, or how to reach him.";
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.3, max_tokens: 700,
        messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }],
      }),
    });
    if (!res.ok) throw new Error("groq");
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || "Sorry — I couldn't answer that. Try asking about a specific project.";
  } catch {
    return "Sorry — I hit a snag reaching the model. Try again, or ask about a project like Kakehashi or C-TRUST.";
  }
}

export async function POST(req: Request) {
  let message = "";
  let history: Turn[] = [];
  try {
    const body = (await req.json()) as Body;
    message = (body.message || "").trim();
    history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!message) return Response.json({ error: "Ask something first." }, { status: 400 });
  if (message.length > 500) return Response.json({ error: "Keep it under 500 characters." }, { status: 400 });

  const system = buildSystemPrompt() + TOOL_NOTE;
  const enc = new TextEncoder();
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(`data: ${JSON.stringify(o)}\n\n`));
      try {
        if (anthropicKey) {
          const client = new Anthropic({ apiKey: anthropicKey });
          let convo: Anthropic.MessageParam[] = [
            ...history.map((h) => ({ role: h.role, content: h.content } as Anthropic.MessageParam)),
            { role: "user", content: message },
          ];
          for (let stepN = 0; stepN < 3; stepN++) {
            const s = client.messages.stream({
              model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
              max_tokens: 900,
              system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
              tools: TOOLS,
              messages: convo,
            });
            s.on("text", (t) => send({ t: "text", v: t }));
            const final = await s.finalMessage();
            const toolUses = final.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
            for (const u of toolUses) send({ t: "card", name: u.name, props: u.input });
            if (final.stop_reason !== "tool_use") break;
            convo = [
              ...convo,
              { role: "assistant", content: final.content },
              { role: "user", content: toolUses.map((u) => ({ type: "tool_result" as const, tool_use_id: u.id, content: "rendered" })) },
            ];
          }
          send({ t: "done" });
        } else {
          send({ t: "text", v: await groqAnswer(system, message, history) });
          send({ t: "done" });
        }
      } catch {
        try { send({ t: "text", v: await groqAnswer(system, message, history) }); } catch { /* ignore */ }
        send({ t: "done" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" } });
}
