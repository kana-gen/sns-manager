"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`登録に失敗しました: ${error.message}`);
      return;
    }

    setMessage(
      "登録しました。確認メールが届いている場合は、メールを確認してください。"
    );
  }

  async function handleLogin() {
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`ログインに失敗しました: ${error.message}`);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-gray-950">
          SNS Manager
        </h1>

        <p className="mt-2 text-gray-700">
          ログイン・アカウント登録
        </p>

        <label className="mt-6 block font-bold text-gray-950">
          メールアドレス
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className="mt-2 w-full rounded-lg border border-gray-400 p-3 text-gray-950"
          placeholder="パスワード"
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleLogin}
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            ログイン
          </button>

          <button
            onClick={handleSignUp}
            className="rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
          >
            新規登録
          </button>
        </div>

        {message && (
          <p className="mt-5 font-semibold text-gray-900">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
