import { NextResponse } from "next/server";
import { sendTelegramMessage }
from "@/lib/telegram";

export async function GET() {
  await sendTelegramMessage(
    "Hello from Kaaktaal 🌧️"
  );

  return NextResponse.json({
    success: true,
  });
}