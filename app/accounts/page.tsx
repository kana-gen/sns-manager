"use client";

import { useState } from "react";

export default function AccountsPage() {
  const [message, setMessage] = useState("");

  function connectX() {
    setMessage("Xとの接続処理はこれから設定します。");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">SNSアカウント</h1>

      <p className="mt-2 text-gray-600">
        管理するSNSアカウントを接続できます
      </p>

      <div className="mt-8 max-w-2xl space-y-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">X</h2>
              <p className="mt-2 text-gray-500">
                アカウント未接続
              </p>
            </div>

            <button
              onClick={connectX}
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Xを接続
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Instagram</h2>
          <p className="mt-2 text-gray-500">アカウント未接続</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Threads</h2>
          <p className="mt-2 text-gray-500">アカウント未接続</p>
        </div>
      </div>

      {message && (
        <p className="mt-6 font-semibold">{message}</p>
      )}
    </main>
  );
}
