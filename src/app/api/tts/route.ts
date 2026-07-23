export const runtime = "nodejs";
export const maxDuration = 30;

// Natural text-to-speech via ElevenLabs.
// If ELEVENLABS_API_KEY isn't set we return 204 and the client silently falls
// back to the browser's built-in speech (robotic, but always available).
const DEFAULT_VOICE = "onwK4e9ZLuTAKqWW03F9"; // "Daniel" — natural male, English

export async function POST(req: Request) {
  let text = "";
  try {
    const body = (await req.json()) as { text?: string };
    text = (body.text || "").trim().slice(0, 2000);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!text) return new Response(null, { status: 400 });

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response(null, { status: 204 }); // not configured

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5",
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
      }),
    });
    if (!r.ok || !r.body) return new Response(null, { status: 502 });
    return new Response(r.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
