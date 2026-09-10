import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">
        SNS Manager
      </h1>

      <p className="mt-2 text-gray-600">
        Instagram・X・Threadsをまとめて管理
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Instagram</h2>
          <p className="mt-2 text-gray-500">未接続</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">X</h2>
          <p className="mt-2 text-gray-500">未接続</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Threads</h2>
          <p className="mt-2 text-gray-500">未接続</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">投稿管理</h2>

        <div className="mt-4 flex gap-4">
          <Link
            href="/create"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            投稿を作成
          </Link>

          <Link
            href="/posts"
            className="rounded-lg border px-5 py-3"
          >
            投稿履歴
          </Link>
        </div>
      </div>
    </main>
  );
}
