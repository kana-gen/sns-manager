export default function SignupCompletePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-gray-950">
          仮登録が完了しました
        </h1>

        <p className="mt-4 text-gray-700">
          登録したメールアドレスに確認メールを送信しました。
        </p>

        <p className="mt-3 font-bold text-red-600">
          30分以内にメールに届いたURLをクリックして、
          本登録を完了してください。
        </p>

        <p className="mt-6 text-sm text-gray-600">
          30分を過ぎると確認URLは使用できなくなります。
        </p>
      </div>
    </main>
  );
}
