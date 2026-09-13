import Link from "next/link";
import LogoutButton from "./components/LogoutButton";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();

  const xConnected =
    cookieStore.get("x_connected")?.value === "1";

  const xUsername =
    cookieStore.get("x_username")?.value ?? "";

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-gray-950">
        SNS Manager
      </h1>

      <p className="mt-2 text-gray-700">
        Instagram・X・Threadsをまとめて管理
      </p>
<div className="mt-4">
  <LogoutButton />
</div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-950">
            Instagram
          </h2>

          <p className="mt-2 font-medium text-gray-700">
            未接続
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-950">
            X
          </h2>

          {xConnected ? (
            <>
              <p className="mt-2 font-bold text-green-700">
                接続済み
              </p>

              {xUsername && (
                <p className="mt-1 text-gray-700">
                  @{xUsername}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mt-2 font-medium text-gray-700">
                未接続
              </p>

              <Link
                href="/api/auth/x"
                className="mt-4 inline-block rounded-lg bg-black px-4 py-2 font-semibold text-white"
              >
                Xを接続
              </Link>

              <p className="mt-2 text-sm text-gray-600">
                Xアカウントを接続します
              </p>
            </>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-950">
            Threads
          </h2>

          <p className="mt-2 font-medium text-gray-700">
            未接続
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-gray-950">
          投稿管理
        </h2>

        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/create"
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            投稿を作成
          </Link>

          <Link
            href="/posts"
            className="rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
          >
            投稿履歴
          </Link>

          <Link
            href="/calendar"
            className="rounded-lg border border-gray-400 px-5 py-3 font-semibold text-gray-900"
          >
            📅 投稿カレンダー
          </Link>
        </div>
      </div>
    </main>
  );
}
