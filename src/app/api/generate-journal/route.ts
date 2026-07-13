import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const DEFAULT_FALLBACK = {
  title: "The Weight of Quiet Verandahs",
  content: "We have been thinking about the spaces that exist between things. Not the notes, but the silence that holds them together. Lately, Dhaka has been breathing differently; the summer heat sits heavily on red-brick walls. We sat on the verandah with a broken microphone and a guitar that refused to stay in tune, letting the tape roll. Some things belong in the archive simply because they happened to be there.",
};

export async function GET() {
  try {
    // 1. Query Supabase for the latest published journal entry
    const { data: rows, error: fetchError } = await supabaseAdmin
      .from("journals")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("[Journal] Supabase SELECT error:", fetchError.message);
    }

    let latest = rows?.[0] ?? null;

    // If no published row found with status filter, try getting latest row regardless of status
    if (!latest) {
      const { data: fallbackRows } = await supabaseAdmin
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      latest = fallbackRows?.[0] ?? null;
    }

    if (latest) {
      return NextResponse.json({
        id: latest.id,
        title: latest.title,
        content: latest.content,
        created_at: latest.created_at,
        status: latest.status ?? "published",
      });
    }

    // Default static fallback if database is completely empty
    return NextResponse.json({
      ...DEFAULT_FALLBACK,
      created_at: new Date().toISOString(),
      status: "published",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Journal] Fatal error in public fetch:", message);

    return NextResponse.json({
      ...DEFAULT_FALLBACK,
      created_at: new Date().toISOString(),
      status: "published",
    });
  }
}