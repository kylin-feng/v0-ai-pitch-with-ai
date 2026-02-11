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
  const state = searchParams.get("state") || ""

  // 从 state 中解析角色信息，格式: random_role
  const stateParts = state.split("_")
  const role = stateParts.length > 1 ? stateParts[stateParts.length - 1] : ""

  console.log("Code:", code ? "received" : "missing")
  console.log("Error:", error || "none")
  console.log("State:", state)
  console.log("Parsed role:", role)

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
    // API 返回驼峰命名 (accessToken) 或下划线命名 (access_token)
    const cookieStore = await cookies()
    const accessToken = tokenData.accessToken || tokenData.access_token
    const refreshToken = tokenData.refreshToken || tokenData.refresh_token
    const expiresIn = tokenData.expiresIn || tokenData.expires_in

    cookieStore.set("secondme_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn || 3600,
    })

    if (refreshToken) {
      cookieStore.set("secondme_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    console.log("Token stored, redirecting to success")
    const successUrl = role
      ? `/?auth_success=true&role=${role}`
      : "/?auth_success=true"
    return NextResponse.redirect(new URL(successUrl, request.url))
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?auth_error=server_error", request.url))
  }
}
