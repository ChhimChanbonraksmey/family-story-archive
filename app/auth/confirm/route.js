import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");

  try {
    const supabase = await createClient();
    const result = tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: true };

    if (!result.error) return NextResponse.redirect(new URL("/", url));
  } catch {
    // An invalid or expired confirmation link returns to the login page.
  }

  return NextResponse.redirect(new URL("/login?confirmation=failed", url));
}
