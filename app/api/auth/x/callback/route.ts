import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?x_error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Xから必要な情報を受け取れませんでした" },
      { status: 400 }
    );
  }

  const savedState = request.cookies.get("x_oauth_state")?.value;
  const codeVerifier = request.cookies.get("x_code_verifier")?.value;

  if (!savedState || savedState !== state) {
    return NextResponse.json(
      { error: "認証情報の確認に失敗しました" },
      { status: 400 }
    );
  }

  if (!codeVerifier) {
    return NextResponse.json(
      { error: "PKCE情報が見つかりませんでした" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      new URL("/login?error=x_login_required", request.url)
    );
  }

  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Xの認証情報が設定されていません" },
      { status: 500 }
    );
  }

  const redirectUri =
    "https://sns-manager-kana.netlify.app/api/auth/x/callback";

  const basicAuth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const tokenResponse = await fetch(
    "https://api.x.com/2/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();

    return NextResponse.json(
      {
        error: "Xのアクセストークン取得に失敗しました",
        details: errorText,
      },
      { status: 500 }
    );
  }

  const tokenData = await tokenResponse.json();

  const userResponse = await fetch(
    "https://api.x.com/2/users/me",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (!userResponse.ok) {
    return NextResponse.json(
      { error: "Xユーザー情報の取得に失敗しました" },
      { status: 500 }
    );
  }

  const userData = await userResponse.json();

  const platformUserId = userData.data?.id ?? "";
  const username = userData.data?.username ?? "";

  if (!platformUserId) {
    return NextResponse.json(
      { error: "XユーザーIDを取得できませんでした" },
      { status: 500 }
    );
  }

  const { error: accountError } = await supabase
    .from("social_accounts")
    .upsert(
      {
        user_id: user.id,
        platform: "X",
        platform_user_id: platformUserId,
        username,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,platform,platform_user_id",
      }
    );

  if (accountError) {
    return NextResponse.json(
      {
        error: "Xアカウント情報の保存に失敗しました",
        details: accountError.message,
      },
      { status: 500 }
    );
  }

  const { error: tokenError } = await supabase
    .from("social_tokens")
    .insert({
      user_id: user.id,
      platform: "X",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
    });

  if (tokenError) {
    return NextResponse.json(
      {
        error: "X認証情報の保存に失敗しました",
        details: tokenError.message,
      },
      { status: 500 }
    );
  }

  const response = NextResponse.redirect(
    new URL("/", request.url)
  );

  response.cookies.set("x_connected", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("x_username", username, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.delete("x_oauth_state");
  response.cookies.delete("x_code_verifier");

  return response;
}
