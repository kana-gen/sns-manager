"use client";

import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-gray-400 px-4 py-2 font-semibold text-gray-900"
    >
      ログアウト
    </button>
  );
}
