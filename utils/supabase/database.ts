import { createClient } from "./client";

export async function testSupabase() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .limit(1);

  return { data, error };
}
