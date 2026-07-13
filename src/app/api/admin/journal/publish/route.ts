import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    console.log("[Admin Journal] Publishing journal:", title);

    const { data, error } = await supabaseAdmin
      .from("journals")
      .insert({
        title: title.trim(),
        content: content.trim(),
        status: "published",
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Journal] Supabase insert error:", error.message);
      return NextResponse.json(
        { success: false, error: "Database error", detail: error.message },
        { status: 500 }
      );
    }

    console.log("[Admin Journal] Successfully published to Supabase:", data.id);

    return NextResponse.json({
      success: true,
      journal: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Admin Journal] Error publishing journal:", message);

    return NextResponse.json(
      { success: false, error: "Failed to publish journal", detail: message },
      { status: 500 }
    );
  }
}
