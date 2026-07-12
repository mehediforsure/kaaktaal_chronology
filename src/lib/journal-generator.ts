import { ai } from "./gemini";

export async function generateJournal(): Promise<{ title: string; content: string }> {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hour = now.getHours();
  const timeOfDay =
    hour < 6 ? "deep night" :
    hour < 12 ? "morning" :
    hour < 17 ? "afternoon" :
    hour < 21 ? "evening" : "late night";

  const prompt = `
You are a poet, a melancholic observer, and a chronicler of the human experience. Your task is to write a short daily journal entry for 
${dateStr}, ${timeOfDay}.
Requirements:
- Title: A single evocative phrase (3-7 words). Poetic, no punctuation at the end. Examples: "The Weight of Quiet Verandahs", "Rain on Rusted Tin", "Letters Never Sent from Sadarghat"
- Content: 70-100 words. Written in first-person plural ("we"). Poetic, melancholic, reflective, slightly absurd. Reference Dhaka, Bengali culture, music-making, home recording equipment, monsoons, river ferries, verandahs, or the Sundarbans. Never mention AI or generation.

Respond with ONLY valid JSON, no markdown fences:
{"title": "...", "content": "..."}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim() || "";

  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const parsed = JSON.parse(cleaned);
    if (parsed.title && parsed.content) {
      return { title: parsed.title, content: parsed.content };
    }
  } catch {
    // If JSON parsing fails, use the raw text as content
  }

  return {
    title: "Fragments from the Archive",
    content: text || "The tape recorder hums in the empty room. Some days the archive has nothing to say, and that silence is its own kind of entry.",
  };
}