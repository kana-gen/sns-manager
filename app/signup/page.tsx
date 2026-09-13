"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setMessage("");

    if (!email || !password) {
      setMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`登録に失敗しました: ${error.message}`);
      return;
    }

    window.location.href = "/signup-complete";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-gray-950">
          SNS Manager
        </h1>

        <p className="mt-2 text-gray-700">
          新規登録
        </p>

        <label className="mt-6 block font-bold text-gray-950">
          メールアドレス
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          className="mt-2 w-full rounded-lg border border-gray-400 p-3 text-gray-950"
          placeholder="メールアドレス"
        />

        <label className="mt-5 block font-bold text-gray-950">
          パスワード
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="mt-2 w-full rounded-lg border border-gray-400 p-3 text-gray-950"
          placeholder="パスワード"
        />

        <button
          onClick={handleSignUp}
          className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-semibold text-white"
        >
          仮登録する
        </button>

        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="mt-3 w-full rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
        >
          ログインはこちら
        </button>

        {message && (
          <p className="mt-5 font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
