"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Post = {
  id: number;
  content: string;
  platform: string;
  status: string;
  scheduled_at: string | null;
};

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("posts")
        .select("id, content, platform, status, scheduled_at")
        .not("scheduled_at", "is", null)
        .order("scheduled_at", { ascending: true });

      if (!error && data) {
        setPosts(data);
      }

      setLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-gray-950">
        投稿カレンダー
      </h1>

      <p className="mt-2 text-gray-700">
        予約した投稿を確認できます
      </p>

      {loading ? (
        <p className="mt-8 text-gray-800">
          読み込み中...
        </p>
      ) : posts.length === 0 ? (
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <p className="text-gray-800">
            予約投稿はまだありません。
          </p>
        </div>
      ) : (
        <div className="mt-8 max-w-3xl space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-900">
                  {post.platform}
                </span>

                <span className="text-sm font-bold text-gray-900">
                  {post.status === "scheduled"
                    ? "予約済み"
                    : post.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap font-medium text-gray-950">
                {post.content}
              </p>

              {post.scheduled_at && (
                <p className="mt-4 font-bold text-gray-800">
                  📅{" "}
                  {new Date(post.scheduled_at).toLocaleString(
                    "ja-JP",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
