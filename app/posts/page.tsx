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

  useEffect(() => {
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

    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">投稿履歴</h1>

      <p className="mt-2 text-gray-600">
        保存した投稿を確認できます
      </p>

      {loading ? (
        <p className="mt-8">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="mt-8">まだ投稿がありません。</p>
      ) : (
        <div className="mt-8 max-w-3xl space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
                  {post.platform}
                </span>

                <span className="text-sm font-semibold">
                  {post.status === "scheduled"
                    ? "予約済み"
                    : "下書き"}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.scheduled_at && (
                <p className="mt-4 text-sm font-semibold">
                  予約日時：
                  {new Date(post.scheduled_at).toLocaleString("ja-JP")}
                </p>
              )}

              <p className="mt-4 text-sm text-gray-400">
                保存日時：
                {new Date(post.created_at).toLocaleString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
