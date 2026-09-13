import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ログインしてください。" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const text = body.text;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "投稿内容を入力してください。" },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: "Xの投稿は280文字以内にしてください。" },
        { status: 400 }
      );
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from("social_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .eq("platform", "X")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenError || !tokenData?.access_token) {
      return NextResponse.json(
        { error: "Xアカウントが連携されていません。" },
        { status: 400 }
      );
    }

    const xResponse = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
    });

    const xData = await xResponse.json();

    if (!xResponse.ok) {
      return NextResponse.json(
        {
          error: "Xへの投稿に失敗しました。",
          details: xData,
        },
        { status: xResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xに投稿しました。",
      data: xData,
    });
  } catch {
    return NextResponse.json(
      { error: "投稿処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
