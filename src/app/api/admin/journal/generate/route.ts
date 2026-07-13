import { NextResponse } from "next/server";
import { generateJournal } from "@/lib/journal-generator";
import { sendTelegramMessage } from "@/lib/telegram";

async function handleGenerate(req: Request) {
  try {
    console.log("[Admin Journal] Generating fresh draft via Gemini...");
    const draft = await generateJournal();
    console.log("[Admin Journal] Draft generated successfully:", draft.title);

    // Construct site admin link
    const host = req.headers.get("host") || "kaaktaal.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    const adminUrl = `${baseUrl.replace(/\/$/, "")}/admin/journal`;

    // Send Telegram Notification
    const telegramMsg = `🌧️ <b>Kaaktaal Journal Draft Ready for Review</b>\n\n<b>Title:</b> ${draft.title}\n\n<b>Content:</b>\n<i>"${draft.content}"</i>\n\n👉 <a href="${adminUrl}">Tap here to Review & Publish</a>`;
    
    sendTelegramMessage(telegramMsg, "HTML").catch((err) => {
      console.error("[Admin Journal] Error triggering Telegram notification:", err);
    });

    return NextResponse.json({
      success: true,
      draft: {
        title: draft.title,
        content: draft.content,
        generated_at: new Date().toISOString(),
      },
      telegramSent: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Admin Journal] Error generating draft:", message);

    return NextResponse.json(
      { success: false, error: "Failed to generate draft", detail: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return handleGenerate(req);
}

export async function GET(req: Request) {
  return handleGenerate(req);
}


