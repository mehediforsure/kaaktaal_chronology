import { NextResponse } from "next/server";
import { generateJournal } from "@/lib/journal-generator";
import { sendTelegramMessage } from "@/lib/telegram";

async function handleGenerate(req: Request) {
  try {
    console.log("[Admin Journal] Generating fresh draft via Gemini...");
    const draft = await generateJournal();
    console.log("[Admin Journal] Draft generated successfully:", draft.title);

    // Construct site admin link (prefer explicit ADMIN_PANEL_URL or main domain)
    let adminUrl = process.env.ADMIN_PANEL_URL;

    if (!adminUrl) {
      let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

      if (!baseUrl && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
      }

      if (!baseUrl) {
        const host = req.headers.get("host") || "kaaktaal.com";
        const protocol = host.includes("localhost") ? "http" : "https";
        baseUrl = `${protocol}://${host}`;
      }

      adminUrl = `${baseUrl.replace(/\/$/, "")}/admin/journal`;
    }



    // Send Telegram Notification (must be awaited in serverless context)
    const telegramMsg = `🌧️ <b>Kaaktaal Journal Draft Ready for Review</b>\n\n<b>Title:</b> ${draft.title}\n\n<b>Content:</b>\n<i>"${draft.content}"</i>`;

    const replyMarkup = {
      inline_keyboard: [
        [{ text: "📝 Review & Publish", url: adminUrl }]
      ]
    };
    
    try {
      await sendTelegramMessage(telegramMsg, "HTML", replyMarkup);
      console.log("[Admin Journal] Telegram notification sent successfully.");
    } catch (err) {
      console.error("[Admin Journal] Error triggering Telegram notification:", err);
    }


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


