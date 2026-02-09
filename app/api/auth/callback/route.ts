import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { exchangeCodeForToken } from "@/lib/secondme"

// Second Me OAuth callback handler
export async function GET(request: NextRequest) {
  console.log("=== OAuth Callback ===")
  console.log("Full URL:", request.url)

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  console.log("Code:", code ? "received" : "missing")
  console.log("Error:", error || "none")

  if (error) {
    console.error("OAuth error:", error)
    return NextResponse.redirect(new URL("/?auth_error=" + error, request.url))
  }

  if (!code) {
    console.error("No code received")
    return NextResponse.redirect(new URL("/?auth_error=no_code", request.url))
  }

  try {
    console.log("Exchanging code for token...")
    const tokenData = await exchangeCodeForToken(code)
    console.log("Token exchange result:", tokenData ? "success" : "failed")

    if (!tokenData) {
      return NextResponse.redirect(new URL("/?auth_error=token_failed", request.url))
    }

    // Store tokens in HTTP-only cookies
    const cookieStore = await cookies()

    cookieStore.set("secondme_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600,
    })

    if (tokenData.refresh_token) {
      cookieStore.set("secondme_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    console.log("Token stored, redirecting to success")
    return NextResponse.redirect(new URL("/?auth_success=true", request.url))
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?auth_error=server_error", request.url))
  }
}
