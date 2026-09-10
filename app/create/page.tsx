"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("X");
  const [scheduledAt, setScheduledAt] = useState("");
  const [message, setMessage] = useState("");

  async function savePost() {
    if (!content.trim()) {
      setMessage("投稿内容を入力してください");
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.from("posts").insert({
      content,
      platform,
      status: scheduledAt ? "scheduled" : "draft",
      scheduled_at: scheduledAt || null,
    });

    if (error) {
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }

    setMessage("保存しました！");
    setContent("");
    setScheduledAt("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">投稿を作成</h1>

      <p className="mt-2 text-gray-600">
        投稿するSNSと内容を設定してください
      </p>

      <div className="mt-8 max-w-2xl rounded-xl bg-white p-6 shadow">
        <label className="font-semibold">投稿内容</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 h-40 w-full rounded-lg border p-3"
          placeholder="ここに投稿内容を入力..."
        />

        <div className="mt-6">
          <p className="font-semibold">投稿先</p>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-3 rounded-lg border p-3"
          >
            <option value="Instagram">Instagram</option>
            <option value="X">X</option>
            <option value="Threads">Threads</option>
          </select>
        </div>

        <div className="mt-6">
          <p className="font-semibold">予約日時</p>

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="mt-3 rounded-lg border p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            空欄なら下書きとして保存されます。
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={savePost}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            保存する
          </button>
        </div>

        {message && (
          <p className="mt-4 font-semibold">{message}</p>
        )}
      </div>
    </main>
  );
}
