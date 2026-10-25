// The publishable key is meant to be public: the database only exposes three
// code-protected functions (see supabase/schema.sql). Override both values with
// VITE_SUPABASE_URL / VITE_SUPABASE_KEY to point the site at another project.
export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://ivnydhtrwensrwdushtk.supabase.co'

export const SUPABASE_KEY: string =
  import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_Q5gbH-rF1oG9l8WuE4ZhYQ_j-iE-xbw'
