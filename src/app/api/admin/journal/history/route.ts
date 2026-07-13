import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data: rows, error } = await supabaseAdmin
      .from("journals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("[Admin Journal History] Supabase error:", error.message);
      return NextResponse.json(
        { success: false, error: "Database query error", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      journals: rows ?? [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Admin Journal History] Fatal error:", message);

    return NextResponse.json(
      { success: false, error: "Failed to fetch history", detail: message },
      { status: 500 }
    );
  }
}
