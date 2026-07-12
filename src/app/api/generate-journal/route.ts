import { NextResponse } from "next/server";
import { generateJournal } from "@/lib/journal-generator";
import { supabase } from "@/lib/supabase";

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // 1. Check Supabase for the most recent journal
    const { data: rows } = await supabase
      .from("journals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    const latest = rows?.[0] ?? null;

    // If we have a recent journal (< 5 min old), serve it cached
    if (latest) {
      const createdAt = new Date(latest.created_at).getTime();
      const age = Date.now() - createdAt;

      if (age < COOLDOWN_MS) {
        return NextResponse.json({
          title: latest.title,
          content: latest.content,
          created_at: latest.created_at,
          cached: true,
        });
      }
    }

    // 2. Generate a fresh journal via Gemini
    const journal = await generateJournal();

    // 3. Store in Supabase
    const { error: insertError } = await supabase.from("journals").insert({
      title: journal.title,
      content: journal.content,
      status: "published",
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
    }

    return NextResponse.json({
      title: journal.title,
      content: journal.content,
      created_at: new Date().toISOString(),
      cached: false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Journal generation error:", message, err);

    // Fallback: try to serve the latest cached journal from Supabase
    try {
      const { data: rows } = await supabase
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      const fallback = rows?.[0] ?? null;

      if (fallback) {
        return NextResponse.json({
          title: fallback.title,
          content: fallback.content,
          created_at: fallback.created_at,
          cached: true,
        });
      }
    } catch (fallbackErr) {
      console.error("Fallback query also failed:", fallbackErr);
    }

    return NextResponse.json(
      { error: "Failed to generate journal", detail: message },
      { status: 500 }
    );
  }
}