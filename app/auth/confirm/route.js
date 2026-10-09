import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") === "/update-password"
    ? "/update-password"
    : "/";
  const otpType = url.searchParams.get("type") === "recovery" ? "recovery" : "email";

  try {
    const supabase = await createClient();
    const result = tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: true };

    if (!result.error) return NextResponse.redirect(new URL(next, url));
  } catch (error) {
    console.error("Auth confirmation failed", error);
  }

  const failurePath = next === "/update-password"
    ? "/forgot-password?recovery=failed"
    : "/login?confirmation=failed";
  return NextResponse.redirect(new URL(failurePath, url));
}
