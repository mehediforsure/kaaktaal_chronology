import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing in Vercel settings.");
  }
  return new GoogleGenAI({ apiKey });
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getGeminiClient();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    return typeof value === "function" ? value.bind(client) : value;
  },
});