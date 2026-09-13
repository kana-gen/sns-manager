"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CreatePage() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("X");
  const [status, setStatus] = useState("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleSave() {
    setMessage("");

    if (!content.trim()) {
      setMessage("投稿内容を入力してください。");
      return;
    }

    if (status === "scheduled" && !scheduledAt) {
      setMessage("予約日時を入力してください。");
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("ログインしてください。");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      content: content.trim(),
      platform,
      status,
      scheduled_at: status === "scheduled" ? scheduledAt : null,
      user_id: user.id,
    });

    if (error) {
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }

    setContent("");
    setScheduledAt("");
    setMessage("保存しました。");
  }

  async function handleXPost() {
    setMessage("");

    if (!content.trim()) {
      setMessage("投稿内容を入力してください。");
      return;
    }

    if (content.trim().length > 280) {
      setMessage("Xの投稿は280文字以内にしてください。");
      return;
    }

    setPosting(true);

    try {
      const response = await fetch("/api/post/x", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Xへの投稿に失敗しました。");
        return;
      }

      setMessage("Xに投稿しました！");
      setContent("");
    } catch {
      setMessage("Xへの投稿中にエラーが発生しました。");
    } finally {
      setPosting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-950">
            投稿を作成
          </h1>

          <p className="mt-2 text-gray-600">
            Instagram・X・Threadsの投稿を作成します。
          </p>

          <label className="mt-6 block font-bold text-gray-950">
            投稿先
          </label>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-950"
          >
            <option value="Instagram">Instagram</option>
            <option value="X">X</option>
            <option value="Threads">Threads</option>
          </select>

          <label className="mt-6 block font-bold text-gray-950">
            投稿内容
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 min-h-48 w-full rounded-lg border border-gray-400 p-3 text-gray-950"
            placeholder="投稿内容を入力してください"
          />

          <p className="mt-2 text-sm text-gray-600">
            {content.length} / 280文字
          </p>

          {platform === "X" && (
            <button
              onClick={handleXPost}
              disabled={posting}
              className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              {posting ? "Xに投稿中..." : "Xに投稿する"}
            </button>
          )}

          <label className="mt-6 block font-bold text-gray-950">
            保存方法
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-950"
          >
            <option value="draft">下書き保存</option>
            <option value="scheduled">予約投稿</option>
          </select>

          {status === "scheduled" && (
            <>
              <label className="mt-6 block font-bold text-gray-950">
                予約日時
              </label>

              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-950"
              />
            </>
          )}

          <button
            onClick={handleSave}
            className="mt-6 w-full rounded-lg bg-gray-700 px-5 py-3 font-semibold text-white"
          >
            保存する
          </button>

          {message && (
            <p className="mt-5 font-semibold text-gray-900">
              {message}
            </p>
          )}

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-4 w-full rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
          >
            トップに戻る
          </button>
        </div>
      </div>
    </main>
  );
}
