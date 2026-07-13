import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service role key.
// This bypasses Row Level Security — use ONLY in API routes, never in client code.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
