"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Post = {
  id: number;
  content: string;
  platform: string;
  status: string;
  created_at: string;
  scheduled_at: string | null;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editPlatform, setEditPlatform] = useState("X");
  const [editScheduledAt, setEditScheduledAt] = useState("");

  async function loadPosts() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }

    setLoading(false);
  }

  async function deletePost(id: number) {
    const supabase = createClient();

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`削除に失敗しました: ${error.message}`);
      return;
    }

    setMessage("削除しました！");
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== id)
    );
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setEditContent(post.content);
    setEditPlatform(post.platform);
    setEditScheduledAt(
      post.scheduled_at
        ? new Date(post.scheduled_at).toISOString().slice(0, 16)
        : ""
    );
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
    setEditPlatform("X");
    setEditScheduledAt("");
  }

  async function updatePost(id: number) {
    if (!editContent.trim()) {
      setMessage("投稿内容を入力してください");
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("posts")
      .update({
        content: editContent,
        platform: editPlatform,
        status: editScheduledAt ? "scheduled" : "draft",
        scheduled_at: editScheduledAt || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setMessage(`編集に失敗しました: ${error.message}`);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id ? data : post
      )
    );

    setMessage("編集内容を保存しました！");
    cancelEdit();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-gray-950">
        投稿履歴
      </h1>

      <p className="mt-2 text-gray-700">
        保存した投稿を確認できます
      </p>

      {message && (
        <p className="mt-4 font-semibold text-gray-900">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-gray-800">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-gray-800">まだ投稿がありません。</p>
      ) : (
        <div className="mt-8 max-w-3xl space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              {editingId === post.id ? (
                <>
                  <h2 className="text-xl font-bold text-gray-950">
                    投稿を編集
                  </h2>

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mt-4 h-40 w-full rounded-lg border border-gray-400 p-3 text-gray-950"
                  />

                  <p className="mt-5 font-bold text-gray-950">
                    投稿先
                  </p>

                  <select
                    value={editPlatform}
                    onChange={(e) => setEditPlatform(e.target.value)}
                    className="mt-3 rounded-lg border border-gray-400 p-3 text-gray-950"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="X">X</option>
                    <option value="Threads">Threads</option>
                  </select>

                  <p className="mt-5 font-bold text-gray-950">
                    予約日時
                  </p>

                  <input
                    type="datetime-local"
                    value={editScheduledAt}
                    onChange={(e) => setEditScheduledAt(e.target.value)}
                    className="mt-3 rounded-lg border border-gray-400 p-3 text-gray-950"
                  />

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => updatePost(post.id)}
                      className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
                    >
                      保存する
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
                    >
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-900">
                      {post.platform}
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {post.status === "scheduled"
                        ? "予約済み"
                        : "下書き"}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-gray-950">
                    {post.content}
                  </p>

                  {post.scheduled_at && (
                    <p className="mt-4 text-sm font-semibold text-gray-800">
                      予約日時：
                      {new Date(post.scheduled_at).toLocaleString("ja-JP")}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-gray-600">
                    保存日時：
                    {new Date(post.created_at).toLocaleString("ja-JP")}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => startEdit(post)}
                      className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                    >
                      編集
                    </button>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
