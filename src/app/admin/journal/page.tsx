import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminJournalClient from "./AdminJournalClient";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  let initialHistory = [];

  try {
    const { data: rows, error } = await supabaseAdmin
      .from("journals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("[Admin Journal Page] Supabase error:", error.message);
    } else if (rows) {
      initialHistory = rows;
    }
  } catch (err: unknown) {
    console.error("[Admin Journal Page] Error fetching initial history:", err);
  }

  return <AdminJournalClient initialHistory={initialHistory} />;
}
